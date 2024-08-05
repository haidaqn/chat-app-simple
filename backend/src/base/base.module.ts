import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import * as controllers from './controllers';
import { DbModule } from './db';
import { JwtService } from '@nestjs/jwt';
import { StorageService } from './services';

@Module({
  imports: [TerminusModule, HttpModule, DbModule],
  controllers: Object.values(controllers),
  providers: [StorageService, JwtService],
})
export class BaseModule {}
