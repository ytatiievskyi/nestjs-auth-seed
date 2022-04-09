import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../common/database/database.service';
import { RegisterUserInput } from '../../common/auth/dto/register-user.input';
import { RedisCacheService } from '../../common/redis-cache/redis-cache.service';
import { VerifyUserDto } from '../../common/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private dbService: DatabaseService,
    private cacheService: RedisCacheService,
  ) {}

  async create(data: RegisterUserInput) {
    const { password, ...created } = await this.dbService.user.create({
      data,
    });
    return created;
  }

  async findByEmail(email: string) {
    const existing = await this.dbService.user.findUnique({
      where: {
        email,
      },
    });
    return existing;
  }

  async findById(id: string) {
    const existing = await this.dbService.user.findUnique({
      where: {
        id,
      },
    });
    return existing;
  }

  async getUnverifiedFromCache(payload: VerifyUserDto) {
    const key = UserService.getRedisKeyForUserCache(payload.email);
    const cachedUserData = await this.cacheService.get(key);
    if (!cachedUserData) {
      throw new NotFoundException('User not found');
    }
    return JSON.parse(cachedUserData);
  }

  async cacheUnverified(payload: RegisterUserInput) {
    const cachePayload = JSON.stringify(payload);
    await this.cacheService.set(
      UserService.getRedisKeyForUserCache(payload.email),
      cachePayload,
      60 * 15,
    );
  }

  static getRedisKeyForUserCache(email: string) {
    return `${email}-registration-data`;
  }
}
