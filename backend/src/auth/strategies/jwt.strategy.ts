import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { JwtPayload, Payload } from '../auth.dtos';
import { DbService, Messages } from '../../base';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private db: DbService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('auth.jwt.secret'),
    });
  }

  public async validate(payload: JwtPayload): Promise<Payload> {
    return {
      userId: payload.sub,
      fullName: payload.fullName,
      email: payload.email,
      sessionId: payload.sessionId,
    };
  }
}
