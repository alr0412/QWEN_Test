import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { BarbersService } from './barbers.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BarberAuthGuard } from '../auth/barber-auth.guard';
import { CreateBarberProfileDto, SetAvailabilityDto } from './dto/barber.dto';

@Controller('barbers')
export class BarbersController {
  constructor(
    private barbersService: BarbersService,
  ) {}

  @Get()
  async findAll(@Query('search') search?: string, @Query('address') address?: string) {
    return this.barbersService.findAll(search, address);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.barbersService.findOne(id);
  }

  @Get(':id/slots')
  async getAvailableSlots(@Param('id') barberId: string, @Query('date') date: string) {
    return this.barbersService.getAvailableSlots(barberId, date);
  }

  @UseGuards(JwtAuthGuard, BarberAuthGuard)
  @Post('profile/me')
  async createProfile(@Request() req, @Body() data: CreateBarberProfileDto) {
    return this.barbersService.createProfile(req.user.id, data);
  }

  @UseGuards(JwtAuthGuard, BarberAuthGuard)
  @Put('profile/me')
  async updateProfile(@Request() req, @Body() data: Partial<CreateBarberProfileDto>) {
    return this.barbersService.updateProfile(req.user.id, data);
  }

  @UseGuards(JwtAuthGuard, BarberAuthGuard)
  @Get('profile/me')
  async getMyProfile(@Request() req) {
    return this.barbersService.getProfileByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard, BarberAuthGuard)
  @Post('availability')
  async setAvailability(@Request() req, @Body() data: SetAvailabilityDto) {
    return this.barbersService.setAvailability(req.user.id, data.windows);
  }
}
