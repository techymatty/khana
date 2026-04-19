import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Chicken Biryani' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Fragrant rice with tender chicken', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 299 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'https://example.com/biryani.jpg', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 'Biryani', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ example: 'restaurant-uuid' })
  @IsString()
  @IsNotEmpty()
  restaurantId: string;
}
