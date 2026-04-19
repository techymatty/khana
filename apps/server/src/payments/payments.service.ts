import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Initialize Razorpay — dynamic import for CommonJS compatibility
    const Razorpay = require('razorpay');
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  async createRazorpayOrder(orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found for this order');
    }

    if (payment.method !== 'RAZORPAY') {
      throw new BadRequestException('This order uses COD payment');
    }

    try {
      // Create Razorpay order (amount in paise)
      const razorpayOrder = await this.razorpay.orders.create({
        amount: Math.round(payment.amount * 100),
        currency: 'INR',
        receipt: orderId,
        notes: {
          orderId,
        },
      });

      // Store Razorpay order ID
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { razorpayOrderId: razorpayOrder.id },
      });

      return {
        success: true,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: this.configService.get<string>('RAZORPAY_KEY_ID'),
      };
    } catch (error) {
      throw new BadRequestException(`Razorpay order creation failed: ${error.message}`);
    }
  }

  async verifyPayment(dto: VerifyPaymentDto) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = dto;
    const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET') || '';

    // Verify signature using HMAC SHA256
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      throw new BadRequestException('Payment verification failed — invalid signature');
    }

    // Update payment record
    const payment = await this.prisma.payment.findFirst({
      where: { razorpayOrderId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId,
        razorpaySignature,
        status: 'COMPLETED',
      },
    });

    return {
      success: true,
      message: 'Payment verified successfully',
      orderId: payment.orderId,
    };
  }
}
