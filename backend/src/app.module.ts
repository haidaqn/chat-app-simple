import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseModule } from './base/base.module';
import { AuthModule } from './auth';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { configuration, DbModule } from './base';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('db.uri'),
      }),
      inject: [ConfigService],
    }),
    DbModule,
    BaseModule,
    AuthModule,
  ],
})
export class AppModule {}
