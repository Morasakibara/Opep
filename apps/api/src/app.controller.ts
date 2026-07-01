import { Controller, Get, Inject } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  @Get()
  getHello(): any {
    return {
      status: 'success',
      message: 'OPEP API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };
  }

  @Get('health')
  @SkipThrottle()
  healthCheck(): any {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('public-key')
  getPublicKey(): any {
    const pubKeyPath = this.configService.get('RSA_PUBLIC_KEY_PATH');
    let publicKey = this.configService.get('RSA_PUBLIC_KEY');

    if (pubKeyPath && fs.existsSync(pubKeyPath)) {
      publicKey = fs.readFileSync(pubKeyPath, 'utf8');
    }

    if (!publicKey) {
      return { publicKey: null, configured: false };
    }

    return { publicKey, configured: true };
  }
}
