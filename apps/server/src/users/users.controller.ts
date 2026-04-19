import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@Request() req, @Body() body: { name?: string; fcmToken?: string }) {
    return this.usersService.update(req.user.id, body);
  }
}
