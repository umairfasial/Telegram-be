import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
// Import the User and Chat modules
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module'; // Chat-related module
import { UserController } from './user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    MongooseModule.forRoot('mongodb://localhost:27017/'), // MongoDB connection
    UserModule,   // Handles user-related functionalities
    AuthModule,   // Handles authentication (phone OTP and JWT)
    ChatModule,   // Handles chat functionalities (chat rooms, messaging)
  ],
  controllers: [UserController],  // Main application controller
  providers: [],       // Main application service
})
export class AppModule {}
