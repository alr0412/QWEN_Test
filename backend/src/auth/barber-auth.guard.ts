import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class BarberAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new Error('Unauthorized');
    }
    if (user.role !== 'BARBER') {
      throw new Error('Forbidden: Barber access required');
    }
    return user;
  }
}
