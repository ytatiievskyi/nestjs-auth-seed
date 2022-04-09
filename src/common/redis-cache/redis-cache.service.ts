import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string): Promise<any> {
    return this.cache.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<string> {
    if (ttl) {
      return this.cache.set(key, value, { ttl });
    }

    return this.cache.set(key, value);
  }
}