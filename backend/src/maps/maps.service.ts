import { Injectable } from '@nestjs/common';

// Mock coordinates for Minsk neighborhoods
const minskLocations: Record<string, { lat: number; lng: number }> = {
  'independence avenue': { lat: 53.9045, lng: 27.5615 },
  'vokzal': { lat: 53.8951, lng: 27.5568 },
  'nezhiga': { lat: 53.9168, lng: 27.4969 },
  'serebryanka': { lat: 53.8847, lng: 27.6269 },
  'uruchye': { lat: 53.9467, lng: 27.6331 },
  'borovlyany': { lat: 53.9736, lng: 27.5686 },
  'zentralny': { lat: 53.9045, lng: 27.5615 },
  'pervomaysky': { lat: 53.9200, lng: 27.6000 },
  'sovetsky': { lat: 53.9100, lng: 27.5500 },
  'oktyabrsky': { lat: 53.8900, lng: 27.5700 },
  'leninsky': { lat: 53.8850, lng: 27.5900 },
  'partizansky': { lat: 53.9000, lng: 27.6200 },
  'zavodskoy': { lat: 53.8750, lng: 27.6400 },
  'frunzensky': { lat: 53.9100, lng: 27.5000 },
};

@Injectable()
export class MapsService {
  async geocode(address: string): Promise<{ lat: number; lng: number; address: string }> {
    const normalizedAddress = address.toLowerCase();
    
    // Try to find a matching neighborhood
    for (const [key, coords] of Object.entries(minskLocations)) {
      if (normalizedAddress.includes(key)) {
        return {
          lat: coords.lat,
          lng: coords.lng,
          address,
        };
      }
    }

    // Default to central Minsk
    return {
      lat: 53.9045,
      lng: 27.5615,
      address,
    };
  }
}
