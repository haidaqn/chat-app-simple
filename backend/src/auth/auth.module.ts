import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthSerializer } from './auth.serializer';
import { AuthService } from './auth.service';
// import { NotificationModule, UserModule } from '../modules';
import { JwtStrategy, JwtVerifyStrategy, LocalStrategy } from './strategies';
import { DbModule } from '../base';

@Global()
@Module({
  imports: [
    DbModule,
    // UserModule,
    // NotificationModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('auth.jwt.secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthSerializer, LocalStrategy, JwtStrategy, JwtVerifyStrategy],
  exports: [AuthService],
})
export class AuthModule {}
