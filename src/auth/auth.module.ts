import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt,strategy';
import { UserModule } from '../user/user.module';
import { jwtConstants } from './constants';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' }, // 1 day expiration for JWT
    }),
    UserModule,
  ],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
