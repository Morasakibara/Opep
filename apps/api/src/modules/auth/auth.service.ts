import { Injectable, UnauthorizedException, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/services/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Agency, SubscriptionPlan } from '../agencies/entities/agency.entity';
import { PasswordService } from '../../common/password/password.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    private readonly passwordService: PasswordService,
  ) {}

  async generateTokens(user: any, agencyPlan: SubscriptionPlan = SubscriptionPlan.BASIC) {
    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
      agencyId: user.agencyId ?? null,
      // Embed plan in JWT so downstream guards (throttler, feature gates) can
      // branch without an extra DB lookup. Stale for up to JWT_EXPIRES_IN —
      // acceptable because subscription upgrades re-issue tokens and an admin
      // can revoke via /users end.
      plan: agencyPlan,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByIdentifier(loginDto.identifier);
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    const isPasswordValid = await this.passwordService.verify(user.passwordHash, loginDto.password);
    if (!isPasswordValid) throw new UnauthorizedException('Identifiants invalides');

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

    const agencyPlan = await this.resolveAgencyPlan(user.agencyId);
    const tokens = await this.generateTokens(user, agencyPlan);

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
    const tokens = await this.generateTokens(user, SubscriptionPlan.BASIC);

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
        isActive: user.isActive,
        preferredLanguage: user.preferredLanguage,
        notificationChannel: user.notificationChannel,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    };
  }

  private async resolveAgencyPlan(agencyId: string | null | undefined): Promise<SubscriptionPlan> {
    if (!agencyId) {
      return SubscriptionPlan.BASIC;
    }
    const agency = await this.agencyRepository.findOne({
      where: { id: agencyId },
      select: ['subscriptionPlan'],
    });
    return agency?.subscriptionPlan ?? SubscriptionPlan.BASIC;
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
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException();

      const agencyPlan = await this.resolveAgencyPlan(user.agencyId);
      return this.generateTokens(user, agencyPlan);
    } catch (e) {
      throw new UnauthorizedException('Token de rafraîchissement invalide');
    }
  }
}
