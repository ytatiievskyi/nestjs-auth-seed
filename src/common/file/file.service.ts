import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileInput } from './dto/create-file.input';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FileService {
  constructor(
    private cacheService: RedisCacheService,
    private dbService: DatabaseService,
  ) {}

  async getAvatarFromCache(payload: { email: string }) {
    const key = FileService.getRedisKeyForAvatar(payload.email);
    const cachedUserData = await this.cacheService.get(key);
    if (!cachedUserData) {
      return null;
    }
    return JSON.parse(cachedUserData);
  }

  async cacheUnverifiedUserAvatar(email: string, avatar: CreateFileInput) {
    const avatarPayload = JSON.stringify(avatar);
    await this.cacheService.set(
      FileService.getRedisKeyForAvatar(email),
      avatarPayload,
      60 * 15,
    );
  }

  async saveUserAvatarFromRedis({ email }: { email: string }) {
    const cachedAvatar = await this.getAvatarFromCache({ email });
    if (cachedAvatar) {
      const saved = await this.dbService.file.create({ data: cachedAvatar });
      return saved;
    }
    console.error(
      new Error(
        `Could not find avatar for user: ${email}. Redis entry: ${cachedAvatar}`,
      ),
    );
    return null;
  }

  static getRedisKeyForAvatar(email) {
    return `${email}-file`;
  }
}
