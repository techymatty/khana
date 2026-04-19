import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics() {
    const [totalUsers, totalRestaurants, totalOrders, totalRiders] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.restaurant.count(),
      this.prisma.order.count(),
      this.prisma.rider.count(),
    ]);

    const revenueResult = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'COMPLETED' },
    });

    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    const recentOrders = await this.prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, phone: true } },
        restaurant: { select: { name: true } },
        payment: { select: { method: true, status: true } },
      },
    });

    return {
      stats: {
        totalUsers,
        totalRestaurants,
        totalOrders,
        totalRiders,
        totalRevenue: revenueResult._sum.amount || 0,
      },
      ordersByStatus: ordersByStatus.reduce(
        (acc, item) => ({ ...acc, [item.status]: item._count.id }),
        {},
      ),
      recentOrders,
    };
  }

  async getPendingRestaurants() {
    return this.prisma.restaurant.findMany({
      where: { isApproved: false },
      include: {
        owner: { select: { name: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveRestaurant(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    return this.prisma.restaurant.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async toggleHalalVerification(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id } });
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    return this.prisma.restaurant.update({
      where: { id },
      data: { halalVerified: !restaurant.halalVerified },
    });
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        user: { select: { name: true, phone: true } },
        restaurant: { select: { name: true } },
        payment: { select: { method: true, status: true, amount: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
