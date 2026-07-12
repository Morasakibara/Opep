import { Injectable, UnauthorizedException, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { UsersService } from '../users/services/users.service';
import { LoginAttemptService } from './services/login-attempt.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Company } from '../companies/entities/company.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { PasswordService } from '../../common/password/password.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly loginAttemptService: LoginAttemptService,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly passwordService: PasswordService,
  ) {}

  async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
      agencyId: user.agencyId ?? null,
      companyId: user.companyId ?? null,
      centreId: user.centreId ?? null,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshTokenStr = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    // Hash and store refresh token in DB
    const tokenHash = crypto.createHash('sha256').update(refreshTokenStr).digest('hex');
    const expiresInMs = this.parseDuration(this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'));
    const expiresAt = new Date(Date.now() + expiresInMs);

    await this.refreshTokenRepository.save({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshTokenStr,
    };
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7d
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 7 * 24 * 60 * 60 * 1000;
    }
  }

  async login(loginDto: LoginDto) {
    // 1. Check if account is locked (5 failed attempts within 15min)
    const lockStatus = await this.loginAttemptService.isLocked(loginDto.identifier);
    if (lockStatus.locked) {
      const minutes = Math.ceil(lockStatus.remainingSeconds / 60);
      throw new ForbiddenException(
        `Compte temporairement bloqué. Veuillez réessayer dans ${minutes} minute(s).`
      );
    }

    // 2. Find user
    const user = await this.usersService.findByIdentifier(loginDto.identifier);
    if (!user) {
      await this.loginAttemptService.recordFailedAttempt(loginDto.identifier);
      throw new UnauthorizedException('Identifiants invalides');
    }

    // 3. Check password
    const isPasswordValid = await this.passwordService.verify(user.passwordHash, loginDto.password);
    if (!isPasswordValid) {
      const attempts = await this.loginAttemptService.recordFailedAttempt(loginDto.identifier);
      const remaining = 5 - attempts;
      throw new UnauthorizedException(
        `Identifiants invalides. ${remaining > 0 ? `Tentatives restantes : ${remaining}` : 'Compte bloqué pour 15 minutes.'}`
      );
    }

    // 4. Clear login attempts on success
    await this.loginAttemptService.clearAttempts(loginDto.identifier);

    // Graceful migration: legacy bcrypt hashes are transparently upgraded to
    // argon2id on the next successful login. The user's session is preserved
    // and future logins take the much faster argon2id verify path.
    if (this.passwordService.needsRehash(user.passwordHash)) {
      try {
        const newHash = await this.passwordService.hash(loginDto.password);
        await this.usersService.update(user.id, { passwordHash: newHash });
        user.passwordHash = newHash;
      } catch (err) {
        // Resilient fallback: if the upgrade write fails (network blip,
        // transient DB issue, lock contention), allow login to proceed with
        // the legacy hash. The user is still authenticated correctly. The
        // migration attempts again on the next successful login.
        this.logger.warn(
          `Failed to upgrade legacy password hash for user ${user.id}: ${(err as Error).message}`,
        );
      }
    }

    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        agencyId: user.agencyId,
        companyId: user.companyId,
        centreId: user.centreId,
        isActive: user.isActive,
        preferredLanguage: user.preferredLanguage,
        notificationChannel: user.notificationChannel,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        agencyId: user.agencyId,
        companyId: user.companyId,
        centreId: user.centreId,
        isActive: user.isActive,
        preferredLanguage: user.preferredLanguage,
        notificationChannel: user.notificationChannel,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    };
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.usersService.findByIdentifierByUserId(userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const isPasswordValid = await this.passwordService.verify(user.passwordHash, currentPassword);
    if (!isPasswordValid) throw new UnauthorizedException('Mot de passe actuel incorrect');

    const passwordHash = await this.passwordService.hash(newPassword);
    await this.usersService.update(user.id, { passwordHash });

    return { message: 'Mot de passe modifié avec succès' };
  }

  async resetPassword(phone: string, newPassword: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const passwordHash = await this.passwordService.hash(newPassword);
    await this.usersService.update(user.id, { passwordHash });

    return { message: 'Mot de passe réinitialisé avec succès' };
  }

  async refreshToken(token: string) {
    try {
      // Verify the JWT signature and expiry
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Check if token exists in DB and is not revoked
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      const storedToken = await this.refreshTokenRepository.findOne({
        where: { tokenHash, isRevoked: false },
      });

      if (!storedToken) {
        throw new UnauthorizedException();
      }

      // Check if expired
      if (storedToken.expiresAt < new Date()) {
        await this.refreshTokenRepository.update(storedToken.id, { isRevoked: true, revokedAt: new Date() });
        throw new UnauthorizedException('Token de rafraîchissement expiré');
      }

      // Revoke the old token (rotation)
      await this.refreshTokenRepository.update(storedToken.id, { isRevoked: true, revokedAt: new Date() });

      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException();

      return this.generateTokens(user);
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('Token de rafraîchissement invalide');
    }
  }

  // ============ Profile (GET /auth/me + PATCH /auth/me) ============

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      role: user.role,
      agencyId: user.agencyId,
      companyId: user.companyId,
      centreId: user.centreId,
      isActive: user.isActive,
      preferredLanguage: user.preferredLanguage,
      notificationChannel: user.notificationChannel,
      notificationPhone: user.notificationPhone,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.usersService.update(userId, dto);
    return this.getProfile(userId);
  }

  // ============ Logout ============

  async logout(userId: string, refreshTokenStr?: string) {
    if (refreshTokenStr) {
      // Revoke specific refresh token
      const tokenHash = crypto.createHash('sha256').update(refreshTokenStr).digest('hex');
      await this.refreshTokenRepository.update(
        { tokenHash, userId },
        { isRevoked: true, revokedAt: new Date() },
      );
    } else {
      // Revoke all refresh tokens for the user
      await this.refreshTokenRepository.update(
        { userId, isRevoked: false },
        { isRevoked: true, revokedAt: new Date() },
      );
    }
    return { message: 'Déconnexion réussie' };
  }
}
