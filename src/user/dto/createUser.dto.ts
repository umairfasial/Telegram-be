import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The user\'s phone number', uniqueItems: true })
  phoneNumber: string;

  @ApiProperty({ description: 'The one-time password for verification', nullable: true })
  otp?: string;

  @ApiProperty({ description: 'Expiration time for the OTP', nullable: true })
  otpExpiration?: Date;

  @ApiProperty({ description: 'Username of the user', nullable: true })
  username?: string;

  @ApiProperty({ description: 'Profile picture URL', nullable: true })
  profilePicture?: string;

  @ApiProperty({ description: 'Last seen timestamp', nullable: true })
  lastSeen?: Date;
}
