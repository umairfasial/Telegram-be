import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
@ApiTags('Auth') // This will categorize the controller under 'Auth' in Swagger UI
export class UserController {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  // Send OTP
  @Post('send-otp')
  @HttpCode(200)
  @ApiOperation({ summary: 'Send OTP to the user’s phone number' }) // Description of the operation
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNumber: { type: 'string', example: '+1234567890' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async sendOtp(@Body('phoneNumber') phoneNumber: string) {
    await this.userService.sendOtp(phoneNumber);
    return { message: 'OTP sent successfully' };
  }

  // Verify OTP
  @Post('verify-otp')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify the OTP and return a JWT' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNumber: { type: 'string', example: '+1234567890' },
        otp: { type: 'string', example: '123456' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'OTP verified and JWT token returned',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'OTP verified' },
        token: { type: 'string', example: 'jwt-token' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid OTP' })
  async verifyOtp(@Body('phoneNumber') phoneNumber: string, @Body('otp') otp: string) {
    const user = await this.userService.verifyOtp(phoneNumber, otp);
    if (!user) {
      return { message: 'Invalid OTP' };
    }

    // If OTP is valid, generate JWT
    const payload = { phoneNumber: user.phoneNumber, sub: user._id };
    const token = this.jwtService.sign(payload);

    return { message: 'OTP verified', token };
  }

  // Create Profile
  @Post('create-profile')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create or update user profile after OTP verification' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNumber: { type: 'string', example: '+1234567890' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        username: { type: 'string', example: 'john_doe' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Profile created successfully' },
        user: {
          type: 'object',
          properties: {
            phoneNumber: { type: 'string', example: '+1234567890' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            username: { type: 'string', example: 'john_doe' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createProfile(
    @Body('phoneNumber') phoneNumber: string,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('username') username: string,
  ) {
    const user = await this.userService.createProfile(phoneNumber, firstName, lastName, username);
    if (!user) {
      return { message: 'Profile creation failed' };
    }

    return {
      message: 'Profile created successfully',
      user: {
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
    };
  }
}
