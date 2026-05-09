import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(barberId: string, data: CreateServiceDto) {
    const barber = await this.prisma.barberProfile.findUnique({ where: { id: barberId } });
    if (!barber) {
      throw new Error('Barber not found');
    }

    return this.prisma.service.create({
      data: {
        barberId,
        ...data,
      },
    });
  }

  async update(id: string, data: Partial<CreateServiceDto>) {
    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.service.delete({
      where: { id },
    });
  }

  async findByBarber(barberId: string) {
    return this.prisma.service.findMany({
      where: { barberId },
    });
  }
}

export class CreateServiceDto {
  name: string;
  price: number;
  durationMinutes: number;
}
