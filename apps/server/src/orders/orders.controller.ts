import {
  Controller, Get, Post, Patch, Param, Body, UseGuards, Request, Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  async create(@Request() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user order history' })
  async getMyOrders(@Request() req) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Get('restaurant/:restaurantId')
  @UseGuards(RolesGuard)
  @Roles('RESTAURANT', 'ADMIN')
  @ApiOperation({ summary: 'Get orders for a restaurant' })
  async getRestaurantOrders(@Param('restaurantId') restaurantId: string) {
    return this.ordersService.findByRestaurant(restaurantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
