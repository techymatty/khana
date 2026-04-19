import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a Razorpay order for payment' })
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createRazorpayOrder(dto.orderId);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify Razorpay payment signature' })
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(dto);
  }
}
