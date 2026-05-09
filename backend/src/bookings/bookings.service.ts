import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../prisma/redis.service';
import { PaymentsService } from './payments.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private paymentsService: PaymentsService,
  ) {}

  async createBooking(customerId: string, data: CreateBookingDto) {
    const { barberId, serviceId, date, startTime } = data;

    // Get service details
    const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      throw new Error('Service not found');
    }

    // Calculate end time
    const [startHour, startMin] = startTime.split(':').map(Number);
    const totalMinutes = startHour * 60 + startMin + service.durationMinutes;
    const endHour = Math.floor(totalMinutes / 60);
    const endMin = totalMinutes % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

    // Check if slot is already locked or booked
    const lockKey = `slot:${barberId}:${date}:${startTime}`;
    const isLocked = await this.redisService.isLocked(lockKey);
    if (isLocked) {
      throw new Error('Slot is currently being booked by another customer');
    }

    // Try to lock the slot
    const locked = await this.redisService.lockSlot(lockKey, customerId, 300); // 5 min TTL
    if (!locked) {
      throw new Error('Slot is no longer available');
    }

    // Generate ERIP code
    const eripCode = await this.paymentsService.generateEripCode(barberId, serviceId, service.price);

    // Create booking with RESERVED status
    const booking = await this.prisma.booking.create({
      data: {
        customerId,
        barberId,
        serviceId,
        date: new Date(date),
        startTime,
        endTime,
        status: 'RESERVED',
        eripCode,
        price: service.price,
      },
      include: {
        service: true,
        barber: true,
      },
    });

    return booking;
  }

  async confirmPayment(eripCode: string): Promise<boolean> {
    // Find booking by ERIP code
    const booking = await this.prisma.booking.findFirst({
      where: { eripCode },
    });

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'CONFIRMED') {
      return true; // Already confirmed
    }

    // Update booking to CONFIRMED
    await this.prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CONFIRMED' },
    });

    // Remove the lock (or let it expire naturally)
    const lockKey = `slot:${booking.barberId}:${booking.date.toISOString().split('T')[0]}:${booking.startTime}`;
    await this.redisService.unlockSlot(lockKey);

    return true;
  }

  async getCustomerBookings(customerId: string) {
    return this.prisma.booking.findMany({
      where: { customerId },
      include: {
        service: true,
        barber: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async getBarberBookings(barberId: string, date?: string, status?: string) {
    const where: any = { barberId };
    
    if (date) {
      where.date = new Date(date);
    }
    
    if (status) {
      where.status = status;
    }

    return this.prisma.booking.findMany({
      where,
      include: {
        service: true,
        customer: { select: { phone: true } },
      },
      orderBy: { date: 'asc' },
    });
  }

  async cancelBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Unlock the slot if it was reserved
    if (booking.status === 'RESERVED') {
      const lockKey = `slot:${booking.barberId}:${booking.date.toISOString().split('T')[0]}:${booking.startTime}`;
      await this.redisService.unlockSlot(lockKey);
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });
  }
}

export class CreateBookingDto {
  barberId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
}
