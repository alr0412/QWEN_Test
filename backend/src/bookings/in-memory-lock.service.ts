import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryLockService {
  private store = new Map<string, { value: string; timer: NodeJS.Timeout }>();

  async isLocked(key: string): Promise<boolean> {
    return this.store.has(key);
  }

  async lockSlot(key: string, value: string, ttlSeconds: number): Promise<boolean> {
    if (this.store.has(key)) return false;
    const timer = setTimeout(() => this.store.delete(key), ttlSeconds * 1000);
    this.store.set(key, { value, timer });
    return true;
  }

  async unlockSlot(key: string): Promise<void> {
    const entry = this.store.get(key);
    if (entry) {
      clearTimeout(entry.timer);
      this.store.delete(key);
    }
  }
}
