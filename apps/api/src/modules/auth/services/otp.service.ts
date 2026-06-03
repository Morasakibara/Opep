import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class OtpService {
  private redis: Redis;

  constructor(
    @InjectQueue('otp-queue') private readonly otpQueue: Queue,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
    });
  }

  async generateOtp(phone: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Stockage dans Redis (valable 5 minutes)
    await this.redis.set(`otp:${phone}`, otp, 'EX', 300);
    
    // Ajout à la file pour envoi (SMS/WhatsApp)
    await this.otpQueue.add('send-otp', { phone, otp }, { removeOnComplete: true });
    
    console.log(`[OTP DEBUG] Code pour ${phone}: ${otp}`);
    return otp;
  }

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    const storedOtp = await this.redis.get(`otp:${phone}`);
    if (storedOtp === otp) {
      await this.redis.del(`otp:${phone}`);
      return true;
    }
    return false;
  }
}
