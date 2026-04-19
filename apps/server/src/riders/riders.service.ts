import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RidersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.rider.findMany({
      include: {
        _count: { select: { orders: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findAvailable() {
    return this.prisma.rider.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async create(data: { name: string; phone: string }) {
    return this.prisma.rider.create({ data });
  }

  async updateLocation(id: string, latitude: number, longitude: number) {
    return this.prisma.rider.update({
      where: { id },
      data: { latitude, longitude },
    });
  }

  async assignToOrder(riderId: string, orderId: string) {
    const rider = await this.prisma.rider.findUnique({ where: { id: riderId } });
    if (!rider) throw new NotFoundException('Rider not found');

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { riderId },
      include: {
        rider: { select: { name: true, phone: true } },
      },
    });
  }
}
