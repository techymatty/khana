import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private ordersGateway: OrdersGateway,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    // Validate menu items and calculate total
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        id: { in: dto.items.map((i) => i.menuItemId) },
        isAvailable: true,
      },
    });

    if (menuItems.length !== dto.items.length) {
      throw new BadRequestException('Some menu items are unavailable');
    }

    // Verify all items belong to same restaurant
    const restaurantIds = new Set(menuItems.map((m) => m.restaurantId));
    if (restaurantIds.size > 1) {
      throw new BadRequestException('All items must be from the same restaurant');
    }

    const restaurantId = menuItems[0].restaurantId;

    // Calculate total
    let total = 0;
    const orderItems = dto.items.map((item) => {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId)!;
      const price = menuItem.price;
      total += price * item.quantity;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price,
      };
    });

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        userId,
        restaurantId,
        total,
        deliveryAddress: dto.deliveryAddress,
        deliveryLat: dto.deliveryLat,
        deliveryLng: dto.deliveryLng,
        items: {
          create: orderItems,
        },
        payment: {
          create: {
            amount: total,
            method: dto.paymentMethod || 'COD',
            status: dto.paymentMethod === 'RAZORPAY' ? 'PENDING' : 'PENDING',
          },
        },
      },
      include: {
        items: {
          include: { menuItem: true },
        },
        payment: true,
        restaurant: {
          select: { id: true, name: true, phone: true },
        },
      },
    });

    return order;
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: {
              select: { id: true, name: true, price: true, image: true },
            },
          },
        },
        restaurant: {
          select: {
            id: true, name: true, image: true, phone: true, address: true,
          },
        },
        payment: true,
        rider: {
          select: { id: true, name: true, phone: true },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        restaurant: {
          select: { id: true, name: true, image: true },
        },
        items: {
          include: {
            menuItem: {
              select: { name: true },
            },
          },
        },
        payment: {
          select: { method: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByRestaurant(restaurantId: string) {
    return this.prisma.order.findMany({
      where: { restaurantId },
      include: {
        user: {
          select: { id: true, name: true, phone: true },
        },
        items: {
          include: {
            menuItem: {
              select: { name: true, price: true },
            },
          },
        },
        payment: {
          select: { method: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        restaurant: { select: { name: true } },
        rider: { select: { name: true, phone: true } },
      },
    });

    // If delivered and COD, mark payment complete
    if (status === 'DELIVERED') {
      await this.prisma.payment.updateMany({
        where: { orderId: id, method: 'COD' },
        data: { status: 'COMPLETED' },
      });
    }

    // Emit real-time update via Socket.io
    this.ordersGateway.sendOrderUpdate(id, {
      orderId: id,
      status: updated.status,
      updatedAt: updated.updatedAt,
      restaurant: updated.restaurant,
      rider: updated.rider,
    });

    return updated;
  }
}
