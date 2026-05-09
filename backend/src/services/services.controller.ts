import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ServicesService } from './services.service';
import { BarberAuthGuard } from '../auth/barber-auth.guard';
import { CreateServiceDto } from './dto/service.dto';

@Controller('barber/services')
@UseGuards(BarberAuthGuard)
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Post()
  async create(@Request() req, @Body() data: CreateServiceDto) {
    const barber = await req.user.barberProfile;
    if (!barber) {
      throw new Error('Barber profile not found');
    }
    return this.servicesService.create(barber.id, data);
  }

  @Get()
  async findAll(@Request() req) {
    const barber = await req.user.barberProfile;
    if (!barber) {
      throw new Error('Barber profile not found');
    }
    return this.servicesService.findByBarber(barber.id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<CreateServiceDto>) {
    return this.servicesService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.servicesService.delete(id);
  }
}
