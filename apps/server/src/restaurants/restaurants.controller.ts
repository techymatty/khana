import {
  Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/guards/jwt-auth.guard';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @ApiOperation({ summary: 'List restaurants (with optional location filter)' })
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'radius', required: false, description: 'Radius in km (default 10)' })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radius') radius?: string,
    @Query('search') search?: string,
  ) {
    return this.restaurantsService.findAll({
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      radius: radius ? parseFloat(radius) : 10,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant detail with menu and reviews' })
  async findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RESTAURANT', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new restaurant' })
  async create(@Request() req, @Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(req.user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RESTAURANT', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update restaurant details' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateRestaurantDto>) {
    return this.restaurantsService.update(id, dto);
  }
}
