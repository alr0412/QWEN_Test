import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InMemoryLockService } from '../bookings/in-memory-lock.service';

@Injectable()
export class BarbersService {
  constructor(
    private prisma: PrismaService,
    private lockService: InMemoryLockService,
  ) {}

  async findAll(search?: string, address?: string) {
    const where: any = {};
    
    if (search || address) {
      where.OR = [];
      if (search) {
        where.OR.push({ salonName: { contains: search, mode: 'insensitive' } });
      }
      if (address) {
        where.OR.push({ address: { contains: address, mode: 'insensitive' } });
      }
    }

    return this.prisma.barberProfile.findMany({
      where,
      include: {
        services: true,
      },
      orderBy: { rating: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.barberProfile.findUnique({
      where: { id },
      include: {
        services: true,
        user: { select: { phone: true } },
      },
    });
  }

  async getAvailableSlots(barberId: string, date: string) {
    const barber = await this.prisma.barberProfile.findUnique({
      where: { id: barberId },
      include: {
        availability: true,
        services: true,
      },
    });

    if (!barber) {
      throw new Error('Barber not found');
    }

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();
    
    // Get availability for this day
    const dayAvailability = barber.availability.filter(a => a.dayOfWeek === dayOfWeek);
    
    if (dayAvailability.length === 0) {
      return [];
    }

    // Parse availability times
    const slots: string[] = [];
    for (const avail of dayAvailability) {
      const [startHour, startMin] = avail.startTime.split(':').map(Number);
      const [endHour, endMin] = avail.endTime.split(':').map(Number);
      
      // Generate 30-minute slots
      let currentTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      
      while (currentTime + 30 <= endTime) {
        const hours = Math.floor(currentTime / 60);
        const mins = currentTime % 60;
        const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        
        // Check if slot is booked
        const existingBooking = await this.prisma.booking.findFirst({
          where: {
            barberId,
            date, // Compare as string
            startTime: timeStr,
            status: { in: ['RESERVED', 'CONFIRMED'] },
          },
        });

        // Check if slot is locked
        const lockKey = `slot:${barberId}:${date}:${timeStr}`;
        const isLocked = await this.lockService.isLocked(lockKey);

        if (!existingBooking && !isLocked) {
          slots.push(timeStr);
        }
        
        currentTime += 30;
      }
    }

    return slots;
  }

  async createProfile(userId: string, data: CreateBarberProfileDto) {
    return this.prisma.barberProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }

  async updateProfile(userId: string, data: Partial<CreateBarberProfileDto>) {
    return this.prisma.barberProfile.update({
      where: { userId },
      data,
    });
  }

  async getProfileByUserId(userId: string) {
    return this.prisma.barberProfile.findUnique({
      where: { userId },
      include: { services: true, availability: true },
    });
  }

  async setAvailability(userId: string, windows: { dayOfWeek: number; startTime: string; endTime: string }[]) {
    // Delete existing availability
    await this.prisma.availabilityWindow.deleteMany({
      where: { barber: { userId } },
    });

    // Create new availability windows
    const barber = await this.prisma.barberProfile.findUnique({ where: { userId } });
    
    return this.prisma.availabilityWindow.createMany({
      data: windows.map(w => ({
        barberId: barber.id,
        ...w,
      })),
    });
  }
}

export class CreateBarberProfileDto {
  salonName: string;
  address: string;
  lat: number;
  lng: number;
  imageUrl?: string;
}
