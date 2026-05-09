import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: null,
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async lockSlot(key: string, value: string, ttlSeconds: number = 300): Promise<boolean> {
    const result = await this.client.set(key, value, 'NX', 'EX', ttlSeconds);
    return result === 'OK';
  }

  async unlockSlot(key: string): Promise<void> {
    await this.client.del(key);
  }

  async isLocked(key: string): Promise<boolean> {
    const value = await this.client.get(key);
    return value !== null;
  }

  async getLockValue(key: string): Promise<string | null> {
    return await this.client.get(key);
  }
}
