import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(phone: string): Promise<{ message: string; otp?: string }> {
    // In production, send SMS via provider
    // For demo, generate and log OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[SMS OTP] Phone: ${phone}, OTP: ${otp}`);
    
    // Create or update user
    await this.prisma.user.upsert({
      where: { phone },
      update: {},
      create: { phone, role: 'CUSTOMER' },
    });

    return { message: 'OTP sent successfully', otp };
  }

  async verifyOtp(phone: string, otp: string): Promise<{ accessToken: string; user: any }> {
    // For demo, accept any 6-digit OTP
    if (!/^\d{6}$/.test(otp)) {
      throw new Error('Invalid OTP format');
    }

    const user = await this.prisma.user.findUnique({
      where: { phone },
      include: { barberProfile: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        barberProfile: user.barberProfile,
      },
    };
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
