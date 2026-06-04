import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): any {
    return {
      status: 'success',
      message: 'OPEP API is running',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    };
  }
}
