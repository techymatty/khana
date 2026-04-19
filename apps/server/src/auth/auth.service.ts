import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(phone: string) {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Invalidate previous OTPs for this phone
    await this.prisma.otpRecord.updateMany({
      where: { phone, verified: false },
      data: { verified: true },
    });

    // Store OTP
    await this.prisma.otpRecord.create({
      data: { phone, otp, expiresAt },
    });

    // In production, integrate SMS provider (MSG91, Twilio, etc.)
    console.log(`📱 OTP for ${phone}: ${otp}`);

    return {
      success: true,
      message: 'OTP sent successfully',
      // Remove this in production — only for dev/testing
      otp_dev: otp,
    };
  }

  async verifyOtp(phone: string, otp: string) {
    const otpRecord = await this.prisma.otpRecord.findFirst({
      where: {
        phone,
        otp,
        verified: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark OTP as verified
    await this.prisma.otpRecord.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await this.prisma.user.create({
        data: { phone },
      });
    }

    // Generate JWT
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    };
  }
}
