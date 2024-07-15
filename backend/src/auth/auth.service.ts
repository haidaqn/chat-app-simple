import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, JwtSign, OauthSignInDto, Payload } from './auth.dtos';
import { compare } from 'bcrypt';
import { google, oauth2_v2 } from 'googleapis';
import { ApiError, CreateUserSsoPayload, QuerySsoUser, SystemRoles } from '../common';
import { HydratedDocument } from 'mongoose';
import { randomString } from '../common/utils';
import { MailService } from '../mailing';
import AppleAuth from 'apple-auth';
import * as fs from 'node:fs';
import { DbService, Messages, User } from '../base';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  private isTest = false;

  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private db: DbService,
    private mail: MailService
  ) {
    this.isTest = this.config.get('NODE_ENV') === 'test';
  }

  public async validateUser(
    email: string,
    password: string
  ): Promise<HydratedDocument<User> | null> {
    const user = await this.db.user
      .findOne({
        email,
      })
      .select('+password');
    if (!user) return null;
    if (!user.password || user.password === '')
      throw new HttpException('USER_LOGIN_SSO', HttpStatus.FORBIDDEN);
    const isValidPassword = await compare(password, user.password);
    if (isValidPassword) {
      delete user.password;
      return user;
    }

    return null;
  }

  public async oauthLogin(serviceId: string, data: OauthSignInDto) {
    const createUserBySSO = async (query: QuerySsoUser, payload: CreateUserSsoPayload) => {
      const existingUser = await this.db.user.findOne({
        ...query,
      });
      if (!existingUser) {
        const checkUserEmail = await this.db.user.findOne({
          email: payload.email,
        });
        if (checkUserEmail) throw new ApiError(Messages.auth.emailUsed, HttpStatus.BAD_REQUEST);
        // Account is not connected, create new
        const newUser = await this.db.user.create({
          email: payload.email,
          fullName: payload.fullName,
          password: '',
          role: SystemRoles.USER,
          emailVerified: true,
          ...query,
          avatar: payload.avatar,
        });
        newUser.emailVerified = true;
        await newUser.save();
        return newUser;
      } else return existingUser;
    };
    switch (serviceId) {
      case 'google':
        const { redirect_uri, code, access_token } = data;
        const googleConfig = this.config.get('auth.google');
        const oauth2Client = new google.auth.OAuth2(
          googleConfig.client_id,
          googleConfig.client_secret,
          redirect_uri
        );
        const oauth2 = google.oauth2({
          auth: oauth2Client,
          version: 'v2',
        });
        let userInfo: oauth2_v2.Schema$Userinfo;
        if (code) {
          const { tokens } = await oauth2Client.getToken(code);
          oauth2Client.setCredentials(tokens);
          userInfo = (await oauth2.userinfo.get()).data;
        } else if (access_token) {
          const ticket = await oauth2Client.verifyIdToken({
            idToken: access_token,
            audience: googleConfig.client_id,
          });
          const payload = ticket.getPayload();
          userInfo = {
            id: payload?.sub,
            email: payload?.email,
            verified_email: payload?.email_verified,
            picture: payload?.picture,
            name: payload?.name,
            given_name: payload?.given_name,
            family_name: payload?.family_name,
          };
        } else {
          throw new HttpException('MISSING_CREDENTIALS', HttpStatus.FORBIDDEN);
        }
        return await createUserBySSO(
          {
            googleId: userInfo.id,
          },
          {
            email: userInfo.email,
            emailVerified: true,
            fullName: userInfo.name,
            avatar: userInfo.picture,
          }
        );

      case 'apple':
        const key = fs.readFileSync(this.config.get('auth.apple.authKeyPath')).toString();
        let auth = new AppleAuth(this.config.get('auth.apple.config'), key, 'text');
        const appleAuthResponse = await auth.accessToken(data.code);
        const applePayload = this.jwt.decode(appleAuthResponse.id_token);
        const appleId = applePayload.sub;

        return await createUserBySSO(
          {
            appleId,
          },
          {
            email: applePayload.email,
            emailVerified: true,
            fullName: applePayload.name || 'Stable User',
            avatar: '',
          }
        );
      default:
        throw new HttpException('INVALID_OAUTH_SERVICE', HttpStatus.FORBIDDEN);
    }
  }

  public validateRefreshToken(data: Payload, refreshToken: string): boolean {
    if (!this.jwt.verify(refreshToken, { secret: this.config.get('auth.jwt.refreshSecret') })) {
      return false;
    }
    const payload = this.jwt.decode<{ sub: string }>(refreshToken);
    return payload.sub === data.userId;
  }

  public async sendVerificationEmail(user: User) {
    let valid = false;
    let verificationCode = randomString().toUpperCase();
    while (!valid) {
      verificationCode = randomString().toUpperCase();
      const found = await this.db.verificationCode.findOne({
        code: verificationCode,
      });
      valid = !found;
    }
    await this.mail.sendUserVerification(user, verificationCode);
  }

  public async jwtRefresh(refreshToken: string): Promise<JwtSign> {
    const payload = this.jwt.decode(refreshToken);
    const userId = payload.sub;
    const user = await this.db.user.getById(userId);
    if (!user) throw new Error('INVALID_USER');
    const session = await this.db.session.getById(payload.sessionId);
    if (!session) throw new UnauthorizedException(Messages.auth.sessionExpired);
    session.expirationDate = dayjs().add(1, 'd').toDate();
    await session.save();

    return this.jwtSign({
      userId: userId,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      sessionId: payload.sessionId,
    });
  }

  public jwtSign(data: Payload): JwtSign {
    const payload: JwtPayload = {
      sub: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      sessionId: data.sessionId,
    };

    return {
      access_token: this.jwt.sign(payload),
      refresh_token: this.getRefreshToken(payload.sub, payload.sessionId),
    };
  }

  public signUser(user: User, sessionId: string) {
    return this.jwtSign({
      userId: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      sessionId,
    });
  }

  public createSession(user: User, platform: string = 'web') {
    return this.db.session.create({
      user: user._id.toString(),
      platform,
      expirationDate: dayjs().add(1, 'd').toDate(),
    });
  }

  public jwtDecode(token: string) {
    return this.jwt.decode(token);
  }

  public getPayload(token: string): Payload | null {
    try {
      const payload = this.jwt.decode<JwtPayload | null>(token);
      if (!payload) {
        return null;
      }

      return {
        userId: payload.sub,
        email: payload.email,
        fullName: payload.fullName,
        role: payload.role,
        sessionId: payload.sessionId,
      };
    } catch {
      return null;
    }
  }

  private getRefreshToken(sub: string, sessionId: string): string {
    return this.jwt.sign(
      { sub, sessionId },
      {
        secret: this.config.get('auth.jwt.refreshSecret'),
        expiresIn: '7d', // Set greater than the expiresIn of the access_token
      }
    );
  }
}
