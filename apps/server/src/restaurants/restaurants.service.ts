import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

interface FindAllOptions {
  lat?: number;
  lng?: number;
  radius?: number;
  search?: string;
}

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(options: FindAllOptions) {
    const { lat, lng, radius = 10, search } = options;

    let restaurants = await this.prisma.restaurant.findMany({
      where: {
        isApproved: true,
        isActive: true,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        menuItems: {
          where: { isAvailable: true },
          take: 3,
          select: { id: true, name: true, price: true },
        },
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: { rating: 'desc' },
    });

    // Location-based filtering using Haversine formula
    if (lat !== undefined && lng !== undefined) {
      restaurants = restaurants.filter((r) => {
        const distance = this.haversineDistance(lat, lng, r.latitude, r.longitude);
        return distance <= radius;
      });

      // Sort by distance
      restaurants.sort((a, b) => {
        const distA = this.haversineDistance(lat, lng, a.latitude, a.longitude);
        const distB = this.haversineDistance(lat, lng, b.latitude, b.longitude);
        return distA - distB;
      });
    }

    return restaurants.map((r) => ({
      ...r,
      distance:
        lat !== undefined && lng !== undefined
          ? Math.round(this.haversineDistance(lat, lng, r.latitude, r.longitude) * 10) / 10
          : null,
    }));
  }

  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: { category: 'asc' },
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Group menu items by category
    const menuByCategory: Record<string, typeof restaurant.menuItems> = {};
    restaurant.menuItems.forEach((item) => {
      const cat = item.category || 'Other';
      if (!menuByCategory[cat]) menuByCategory[cat] = [];
      menuByCategory[cat].push(item);
    });

    return {
      ...restaurant,
      menuByCategory,
    };
  }

  async create(ownerId: string, dto: CreateRestaurantDto) {
    return this.prisma.restaurant.create({
      data: {
        ...dto,
        ownerId,
      },
    });
  }

  async update(id: string, data: Partial<CreateRestaurantDto>) {
    return this.prisma.restaurant.update({
      where: { id },
      data,
    });
  }

  // Haversine formula — distance in km between two lat/lng
  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
