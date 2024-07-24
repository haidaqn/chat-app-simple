import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  timestamps: true,
})
export class User {
  @ApiProperty()
  _id: mongoose.Schema.Types.ObjectId;

  @ApiProperty()
  @Prop()
  avatar?: string;

  @ApiProperty()
  @Prop()
  fullName: string;

  @Prop({})
  password?: string;

  @ApiProperty()
  @Prop({
    type: String,
    unique: true,
  })
  email: string;

  @ApiProperty()
  @Prop()
  emailVerified: boolean;

  @ApiProperty()
  @Prop({})
  googleId?: string;

  @ApiProperty()
  @Prop()
  appleId?: string;
}
