import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Register the User schema
  ],
  providers: [UserService],
  exports: [UserService], // Export the service if needed in other modules
})
export class UserModule {}
