import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/services/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Agency, SubscriptionPlan } from '../agencies/entities/agency.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
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

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Identifiants invalides');

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

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) throw new UnauthorizedException('Mot de passe actuel incorrect');

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user.id, { passwordHash });

    return { message: 'Mot de passe modifié avec succès' };
  }

  async resetPassword(phone: string, newPassword: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const passwordHash = await bcrypt.hash(newPassword, 10);
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
