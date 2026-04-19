import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Al-Baik Express' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Authentic Arabian food', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 19.076 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 72.8777 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: '23, Mohammed Ali Road, Mumbai' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '9000000001' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
