import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop({ required: true })
  chatId: string;  // Reference to chat

  @Prop({ required: true })
  senderId: string;  // User ID

  @Prop({ required: true })
  content: string;

  @Prop()
  sentAt: Date;

  @Prop()
  isRead: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
