import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseService } from '../../common/database/database.service';
import { ConfigModule } from '@nestjs/config';
import { UserResolver } from './user.resolver';
import { RedisCacheModule } from '../../common/redis-cache/redis-cache.module';

@Module({
  imports: [ConfigModule, RedisCacheModule],
  providers: [UserService, DatabaseService, UserResolver],
  exports: [UserService, DatabaseService],
})
export class UserModule {}
