import { Controller, Get, Query } from '@nestjs/common';
import { MapsService } from './maps.service';

@Controller('maps')
export class MapsController {
  constructor(private mapsService: MapsService) {}

  @Get('geocode')
  async geocode(@Query('address') address: string) {
    return this.mapsService.geocode(address);
  }
}
