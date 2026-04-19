import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../auth/guards/jwt-auth.guard';
import { MenuService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'Get menu items by restaurant' })
  async findByRestaurant(@Query('restaurantId') restaurantId: string) {
    return this.menuService.findByRestaurant(restaurantId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RESTAURANT', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a menu item' })
  async create(@Body() dto: CreateMenuItemDto) {
    return this.menuService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RESTAURANT', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a menu item' })
  async update(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('RESTAURANT', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a menu item' })
  async delete(@Param('id') id: string) {
    return this.menuService.delete(id);
  }
}
