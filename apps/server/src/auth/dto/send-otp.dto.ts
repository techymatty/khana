import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '9100000001', description: '10-digit Indian phone number' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit Indian phone number' })
  phone: string;
}
