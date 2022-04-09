import type { RedisClientOptions } from 'redis';
import { CacheModule as NestCacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './common/database/database.service';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule as NestModuleMailer } from '@nestjs-modules/mailer';
import { MailerModule } from './common/mailer/mailer.module';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './common/auth/auth.module';
import { RedisCacheModule } from './common/redis-cache/redis-cache.module';
import { PubSubModule } from './common/pub-sub/pub-sub.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        playground: configService.get('NODE_ENV') === 'development',
        debug: configService.get('NODE_ENV') === 'development',
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        installSubscriptionHandlers: true,
        context: async ({ req, connection }) => {
          if (connection) {
            return { req: connection.context };
          }
          return { req };
        }
      }),
    }),
    NestModuleMailer.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: configService.get('MAILER_URL'),
        defaults: {
          from: 'no-reply@test.com',
        },
        template: {
          dir: join(process.cwd(), 'static/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    RedisCacheModule,
    MailerModule,
    AuthModule,
    PubSubModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
