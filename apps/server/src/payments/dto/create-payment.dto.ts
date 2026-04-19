import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 'order-uuid' })
  @IsString()
  @IsNotEmpty()
  orderId: string;
}
