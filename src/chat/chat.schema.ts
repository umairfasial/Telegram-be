import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Chat extends Document {
  @Prop({ required: true })
  participants: string[];  // User IDs

  @Prop()
  lastMessage: string;

  @Prop()
  lastMessageTime: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
