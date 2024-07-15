import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// import { SystemRole } from '../common';
import { Transform } from 'class-transformer';
import { Messages } from '../base/config';
import { IsOptionalNonNullable } from '../common/decorators';

export interface JwtSign {
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload {
  sub: string;
  fullName: string;
  email: string;
  role: [];
  sessionId: string;
}

export interface Payload {
  userId: string;
  fullName: string;
  email: string;
  role: [];
  sessionId: string;
}

export class RefreshTokenDto {
  @IsString()
  refresh_token: string;
}

export class LoginResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}

export class LoginDto {
  @ApiProperty({
    default: 'example@gmail.com',
  })
  @IsEmail(
    {},
    {
      message: 'INVALID_EMAIL',
    }
  )
  email: string;

  @ApiProperty({
    default: 'P@ssword~sample1',
  })
  @IsNotEmpty({
    message: 'PASSWORD_REQUIRED',
  })
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    default: 'example@gmail.com',
  })
  @IsEmail(
    {},
    {
      message: Messages.common.invalidEmail,
    }
  )
  @Transform(({ value }) => value.toString().toLowerCase())
  email: string;

  @ApiProperty({
    default: 'John Doe',
  })
  @IsString({
    message: Messages.common.invalidName,
  })
  @IsNotEmpty({
    message: Messages.common.nameRequired,
  })
  fullName: string;

  @ApiProperty({
    default: 'P@ssword~sample1',
  })
  @IsNotEmpty({
    message: 'PASSWORD_REQUIRED',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minSymbols: 0,
      minLowercase: 0,
      minUppercase: 0,
    },
    {
      message: 'PASSWORD_TOO_WEAK',
    }
  )
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty({
    message: 'OLD_PASSWORD_REQUIRED',
  })
  oldPassword: string;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty({
    message: 'NEW_PASSWORD_REQUIRED',
  })
  @MinLength(6, {
    message: 'PASSWORD_TOO_SHORT',
  })
  newPassword: string;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty({
    message: 'CONFIRM_PASSWORD_REQUIRED',
  })
  @MinLength(6, {
    message: 'PASSWORD_TOO_SHORT',
  })
  confirmPassword: string;
}

export class OauthSignInDto {
  @ApiProperty()
  @IsString()
  @IsOptionalNonNullable()
  code?: string;

  @ApiProperty()
  @IsString()
  @IsOptionalNonNullable()
  access_token?: string;

  @ApiProperty()
  @IsString()
  @IsOptionalNonNullable()
  id_token?: string;

  @ApiProperty()
  @IsString()
  @IsOptionalNonNullable()
  redirect_uri?: string;
}

export class ResendEmailDto {
  @IsString()
  @IsEmail(
    {},
    {
      message: Messages.common.invalidEmail,
    }
  )
  @Transform(({ value }) => value.toString().toLowerCase())
  email: string;

  @IsString()
  @IsNotEmpty({
    message: Messages.common.missingField,
  })
  captcha: string;
}

export class VerifyUserDto {
  @IsNotEmpty({
    message: 'EMAIL_REQUIRED',
  })
  @IsEmail(
    {},
    {
      message: 'INVALID_EMAIL',
    }
  )
  @ApiProperty({
    type: String,
    default: 'example@gmail.com',
  })
  @Transform(({ value }) => value.toString().toLowerCase())
  email: string;

  @IsNotEmpty({
    message: 'CODE_REQUIRED',
  })
  @IsString({
    message: 'INVALID_CODE',
  })
  @ApiProperty({
    type: String,
    default: '123456',
  })
  code: string;
}

export class UpdateSessionDeviceDto {
  @ApiProperty({})
  @IsOptionalNonNullable()
  @IsString()
  fcmToken?: string;

  @ApiProperty({})
  @IsOptionalNonNullable()
  @IsString()
  deviceName?: string;

  @ApiProperty({})
  @IsOptionalNonNullable()
  @IsString()
  deviceOS?: string;
}
