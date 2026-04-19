import { IsString, IsNotEmpty, IsArray, IsNumber, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: 'menu-item-uuid' })
  @IsString()
  @IsNotEmpty()
  menuItemId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: '23, Mohammed Ali Road, Mumbai 400003' })
  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @ApiProperty({ example: 19.076, required: false })
  @IsNumber()
  @IsOptional()
  deliveryLat?: number;

  @ApiProperty({ example: 72.8777, required: false })
  @IsNumber()
  @IsOptional()
  deliveryLng?: number;

  @ApiProperty({ enum: ['COD', 'RAZORPAY'], example: 'COD' })
  @IsString()
  @IsOptional()
  paymentMethod?: 'COD' | 'RAZORPAY';
}
