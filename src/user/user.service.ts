import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { Twilio } from 'twilio';
import { User } from './user.schema';

@Injectable()
export class UserService {
  private twilioClient: Twilio;

  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN; 
    console.log('Sending from:', process.env.TWILIO_FROM_NUMBER);

    // Check if the SID and token are properly loaded
    if (!accountSid || !authToken) {
      throw new Error('Twilio SID and Auth Token must be set');
    }
    this.twilioClient = new Twilio(accountSid, authToken); // Replace with your Twilio SID and token
  }

  // Generate a 6-digit OTP
  private generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP to the user's phone number
  async sendOtp(phoneNumber: string): Promise<string> {
    const otp = this.generateOtp();
    const expirationTime = moment().add(10, 'minutes').toDate(); // OTP expires in 10 minutes

    const user = await this.userModel.findOneAndUpdate(
      { phoneNumber },
      { phoneNumber, otp, otpExpiration: expirationTime },
      { upsert: true, new: true },
    );

    // Use Twilio to send the OTP via SMS
    await this.twilioClient.messages.create({
      body: `Your verification code is: ${otp}`,
      from: process.env.TWILIO_FROM_NUMBER, // Replace with your Twilio number
      to: phoneNumber,
    });

    return otp; // For testing, return the OTP. In production, this should not be returned.
  }

  // Verify OTP
  async verifyOtp(phoneNumber: string, otp: string): Promise<User | null> {
    const user = await this.userModel.findOne({ phoneNumber });

    if (!user || user.otp !== otp || moment().isAfter(user.otpExpiration)) {
      return null; // Invalid or expired OTP
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiration = null;
    await user.save();

    return user;
  }

  // Create or update user profile
  async createProfile(phoneNumber: string, firstName: string, lastName: string, username: string): Promise<User | null> {
    const user = await this.userModel.findOneAndUpdate(
      { phoneNumber },
      { firstName, lastName, username },
      { new: true } // Return the updated user
    );

    return user; // Return the updated user profile
  }
  // Find user by phone number
  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userModel.findOne({ phoneNumber }).exec();
  }
}
