import { Injectable, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../../common/redis/redis.module';

@Injectable()
export class OtpService {
  constructor(
    @InjectQueue('otp-queue') private readonly otpQueue: Queue,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async generateOtp(phone: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Stockage dans Redis (valable 5 minutes)
    await this.redis.set(`otp:${phone}`, otp, 'EX', 300);
    
    // Ajout à la file pour envoi (SMS/WhatsApp)
    await this.otpQueue.add('send-otp', { phone, otp }, { removeOnComplete: true });
    
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
