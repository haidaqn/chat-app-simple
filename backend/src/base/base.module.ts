import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import * as controllers from './controllers';
import { DbModule } from './db';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TerminusModule, HttpModule, DbModule],
  controllers: Object.values(controllers),
  providers: [JwtService],
})

export class BaseModule {}
