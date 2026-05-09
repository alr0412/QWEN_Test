import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BarbersModule } from './barbers/barbers.module';
import { BookingsModule } from './bookings/bookings.module';
import { ServicesModule } from './services/services.module';
import { PaymentsModule } from './payments/payments.module';
import { MapsModule } from './maps/maps.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BarbersModule,
    BookingsModule,
    ServicesModule,
    PaymentsModule,
    MapsModule,
  ],
})
export class AppModule {}
