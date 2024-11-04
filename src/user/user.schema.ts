import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;
  
  @Prop({ default: null })
  otp: string;

  @Prop({ default: null })
  otpExpiration: Date;

  @Prop({ default: null })
  username: string;

  @Prop({ default: null })
  profilePicture: string;

  @Prop({ default: new Date() })
  lastSeen: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
 