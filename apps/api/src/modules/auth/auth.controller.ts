import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpService } from './services/otp.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      ...result,
      user: UserResponseDto.fromEntity(result.user),
    };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.register(createUserDto);
    return {
      ...result,
      user: UserResponseDto.fromEntity(result.user),
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body('phone') phone: string) {
    await this.otpService.generateOtp(phone);
    return { message: 'OTP envoyé avec succès' };
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body('phone') phone: string, @Body('otp') otp: string) {
    const isValid = await this.otpService.verifyOtp(phone, otp);
    if (!isValid) throw new UnauthorizedException('Code OTP invalide ou expiré');
    return { message: 'OTP vérifié avec succès' };
  }
}
