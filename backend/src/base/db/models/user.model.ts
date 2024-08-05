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
  email: string;

  @ApiProperty()
  @Prop()
  avatar: string;

  @ApiProperty()
  @Prop()
  fullName: string;
}
