import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { OtpService } from './services/otp.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
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
  @Throttle({ short: { limit: 30, ttl: 60000 } })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      ...result,
      user: UserResponseDto.fromEntity(result.user),
    };
  }

  @Post('register')
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.register(createUserDto);
    return {
      ...result,
      user: UserResponseDto.fromEntity(result.user),
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 15, ttl: 60000 } })
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  async sendOtp(@Body('phone') phone: string) {
    await this.otpService.generateOtp(phone);
    return { message: 'OTP envoy\u00e9 avec succ\u00e8s' };
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  async verifyOtp(@Body('phone') phone: string, @Body('otp') otp: string) {
    const isValid = await this.otpService.verifyOtp(phone, otp);
    if (!isValid) throw new UnauthorizedException('Code OTP invalide ou expir\u00e9');
    return { message: 'OTP v\u00e9rifi\u00e9 avec succ\u00e8s' };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req: any) {
    return this.authService.changePassword(
      req.user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.phone,
      resetPasswordDto.newPassword,
    );
  }
}
