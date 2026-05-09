import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BarberAuthGuard } from '../auth/barber-auth.guard';
import { CreateBookingDto } from './dto/booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() data: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user.id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyBookings(@Request() req) {
    return this.bookingsService.getCustomerBookings(req.user.id);
  }

  @UseGuards(JwtAuthGuard, BarberAuthGuard)
  @Get('barber')
  async getBarberBookings(@Request() req, @Query('date') date?: string, @Query('status') status?: string) {
    const barber = req.user.barberProfile;
    if (!barber) {
      throw new Error('Barber profile not found');
    }
    return this.bookingsService.getBarberBookings(barber.id, date, status);
  }

  // Mock webhook for payment confirmation (no auth for demo)
  @Post('webhook')
  async confirmPayment(@Body() data: { eripCode: string }) {
    return this.bookingsService.confirmPayment(data.eripCode);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  async cancelBooking(@Param('id') id: string) {
    return this.bookingsService.cancelBooking(id);
  }
}
