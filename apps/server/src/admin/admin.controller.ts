import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('analytics')
  @ApiOperation({ summary: 'Get dashboard analytics' })
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('restaurants/pending')
  @ApiOperation({ summary: 'Get restaurants pending approval' })
  async getPendingRestaurants() {
    return this.adminService.getPendingRestaurants();
  }

  @Patch('restaurants/:id/approve')
  @ApiOperation({ summary: 'Approve a restaurant' })
  async approveRestaurant(@Param('id') id: string) {
    return this.adminService.approveRestaurant(id);
  }

  @Patch('restaurants/:id/verify')
  @ApiOperation({ summary: 'Toggle halal verification badge' })
  async toggleHalalVerification(@Param('id') id: string) {
    return this.adminService.toggleHalalVerification(id);
  }

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Get('orders')
  @ApiOperation({ summary: 'List all orders' })
  async getOrders() {
    return this.adminService.getAllOrders();
  }
}
