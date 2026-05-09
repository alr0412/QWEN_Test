import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  private mockEripCodes: Map<string, any> = new Map();

  /**
   * Generate a mock ERIP payment code
   * In production, this would call the bePaid API
   */
  async generateEripCode(barberId: string, serviceId: string, amount: number): Promise<string> {
    // Generate a unique ERIP code (format: XXXX-XXXX-XXXX)
    const eripCode = `ERIP-${uuidv4().split('-').slice(0, 3).join('-').toUpperCase()}`;
    
    // Store mock payment info
    this.mockEripCodes.set(eripCode, {
      barberId,
      serviceId,
      amount,
      createdAt: new Date(),
      status: 'PENDING',
    });

    return eripCode;
  }

  /**
   * Verify and process a mock payment
   * In production, this would verify with bePaid
   */
  async verifyPayment(eripCode: string): Promise<{ valid: boolean; amount?: number }> {
    const paymentInfo = this.mockEripCodes.get(eripCode);
    
    if (!paymentInfo) {
      return { valid: false };
    }

    if (paymentInfo.status === 'PAID') {
      return { valid: true, amount: paymentInfo.amount };
    }

    // Mark as paid
    paymentInfo.status = 'PAID';
    this.mockEripCodes.set(eripCode, paymentInfo);

    return { valid: true, amount: paymentInfo.amount };
  }

  /**
   * Get payment info for demo purposes
   */
  getPaymentInfo(eripCode: string): any {
    return this.mockEripCodes.get(eripCode);
  }
}
