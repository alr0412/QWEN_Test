import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  barberId: string;

  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @IsNotEmpty()
  @IsString()
  date: string; // YYYY-MM-DD

  @IsNotEmpty()
  @IsString()
  startTime: string; // HH:mm
}

export class ConfirmPaymentDto {
  @IsNotEmpty()
  @IsString()
  eripCode: string;
}
