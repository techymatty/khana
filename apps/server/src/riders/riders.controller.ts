import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/guards/jwt-auth.guard';
import { RidersService } from './riders.service';

@ApiTags('Riders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('riders')
export class RidersController {
  constructor(private readonly ridersService: RidersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List all riders' })
  async findAll() {
    return this.ridersService.findAll();
  }

  @Get('available')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'RESTAURANT')
  @ApiOperation({ summary: 'Get available riders' })
  async findAvailable() {
    return this.ridersService.findAvailable();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a new rider' })
  async create(@Body() body: { name: string; phone: string }) {
    return this.ridersService.create(body);
  }

  @Patch(':id/location')
  @ApiOperation({ summary: 'Update rider location' })
  async updateLocation(
    @Param('id') id: string,
    @Body() body: { latitude: number; longitude: number },
  ) {
    return this.ridersService.updateLocation(id, body.latitude, body.longitude);
  }

  @Patch(':id/assign/:orderId')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'RESTAURANT')
  @ApiOperation({ summary: 'Assign rider to order' })
  async assignToOrder(
    @Param('id') riderId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.ridersService.assignToOrder(riderId, orderId);
  }
}
