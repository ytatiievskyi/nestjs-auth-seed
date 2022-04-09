import type { RedisClientOptions } from 'redis';
import { CacheModule as NestCacheModule, Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';


@Module({
  imports: [
    ConfigModule,
    NestCacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        store: redisStore,
        isGlobal: true,
      }),
    }),
  ],
  providers: [RedisCacheService],
  exports: [
    RedisCacheService,
    NestCacheModule,
    ConfigModule,
  ],
})
export class RedisCacheModule {
  constructor() {}
}
