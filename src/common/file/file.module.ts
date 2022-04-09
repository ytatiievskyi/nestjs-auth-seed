import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { DatabaseService } from '../database/database.service';

@Module({
  imports: [RedisCacheModule],
  providers: [FileService, DatabaseService],
  exports: [FileService, DatabaseService],
})
export class FileModule {}
