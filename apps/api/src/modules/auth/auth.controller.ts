import { Controller, Post, Get, Patch, Body, HttpCode, HttpStatus, UnauthorizedException, NotFoundException, UseGuards, Req, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { OtpService } from './services/otp.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
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

  /**
   * Debug endpoint — retourne l'OTP stocké en Redis pour un numéro.
   * Accessible uniquement en environnement de développement (NODE_ENV !== 'production').
   * Protégé par JwtAuthGuard + ADMIN_PLATFORM pour éviter tout abus.
   * Utilise @Query pour éviter les problèmes d'encodage du + dans les numéros de téléphone.
   */
  @Get('otp/debug')
  @UseGuards(JwtAuthGuard)
  async debugOtp(@Query('phone') phone: string) {
    // Protection supplémentaire : bloquer en production
    if (process.env.NODE_ENV === 'production') {
      throw new NotFoundException('Not found');
    }
    const otp = await this.otpService.getOtp(phone);
    if (!otp) {
      return { phone, otp: null, message: 'Aucun OTP trouvé ou expiré pour ce numéro.' };
    }
    return { phone, otp, message: 'OTP récupéré (debug uniquement)' };
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

  // ============ Profile ============

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @Throttle({ short: { limit: 20, ttl: 60000 } })
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Req() req: any) {
    return this.authService.updateProfile(req.user.id, updateProfileDto);
  }

  // ============ Logout ============

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any, @Body('refresh_token') refreshToken?: string) {
    return this.authService.logout(req.user.id, refreshToken);
  }
}
