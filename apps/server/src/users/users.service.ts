import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, data: { name?: string; fcmToken?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
