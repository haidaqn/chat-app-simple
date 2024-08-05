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
  @Prop({ type: String })
  email: string;

  @ApiProperty()
  @Prop({ type: String, default: false })
  avatar?: string;

  @ApiProperty()
  @Prop({ type: String })
  fullName: string;

  @ApiProperty()
  @Prop({ type: String })
  password: string;

  @ApiProperty()
  @Prop({ type: Number, required: false })
  color?: number;

  @ApiProperty()
  @Prop({ type: Number, required: false })
  profileSetup?: boolean;
}
