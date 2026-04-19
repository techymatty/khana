import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPaymentDto {
  @ApiProperty({ example: 'order_xxxxx' })
  @IsString()
  @IsNotEmpty()
  razorpayOrderId: string;

  @ApiProperty({ example: 'pay_xxxxx' })
  @IsString()
  @IsNotEmpty()
  razorpayPaymentId: string;

  @ApiProperty({ example: 'signature_hash' })
  @IsString()
  @IsNotEmpty()
  razorpaySignature: string;
}
