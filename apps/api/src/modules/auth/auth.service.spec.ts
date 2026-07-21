import { Test } from '@nestjs/testing';
import { UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UsersService } from '../users/services/users.service';
import { PasswordService } from '../../common/password/password.service';
import { LoginAttemptService } from './services/login-attempt.service';
import { Company } from '../companies/entities/company.entity';
import { RefreshToken } from './entities/refresh-token.entity';

describe('AuthService', () => {
  let authService: AuthService;

  const mockUser = {
    id: 'u-1',
    firstName: 'Awa',
    lastName: 'Ndiaye',
    phone: '670000001',
    email: 'awa@opep.test',
    passwordHash: '$2b$10$abcdefghijklmnopqrstuv',
    role: 'CLIENT',
    agencyId: null,
    isActive: true,
    preferredLanguage: 'fr',
    notificationChannel: 'SMS',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    findByIdentifier: jest.fn(),
    findByIdentifierByUserId: jest.fn(),
    findById: jest.fn(),
    findByPhone: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockPasswordService: any = {
    hash: jest.fn(),
    verify: jest.fn(),
    needsRehash: jest.fn().mockReturnValue(false),
    isArgon2: jest.fn(),
    isLegacyBcrypt: jest.fn(),
  };

  const mockLoginAttemptService = {
    isLocked: jest.fn(),
    recordFailedAttempt: jest.fn(),
    clearAttempts: jest.fn(),
  };

  const mockJwtService: any = {
    sign: jest.fn().mockReturnValue('mock-access-token'),
    verify: jest.fn(),
  };

  const mockConfigService: any = {
    get: jest.fn((key: string, def?: any) => def ?? 'test-secret'),
  };

  const mockCompanyRepository = {
    findOne: jest.fn().mockResolvedValue(null),
  };

  const mockRefreshTokenRepository = {
    save: jest.fn().mockResolvedValue(undefined),
    findOne: jest.fn(),
    update: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockLoginAttemptService.isLocked.mockResolvedValue({ locked: false, remainingSeconds: 0 });
    mockLoginAttemptService.recordFailedAttempt.mockResolvedValue(1);
    mockLoginAttemptService.clearAttempts.mockResolvedValue(undefined);
    mockRefreshTokenRepository.findOne.mockResolvedValue({
      id: 'rt-1',
      userId: 'u-1',
      tokenHash: 'hash',
      isRevoked: false,
      expiresAt: new Date(Date.now() + 60_000),
    });
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: LoginAttemptService, useValue: mockLoginAttemptService },
        { provide: PasswordService, useValue: mockPasswordService },
        // AuthService injects Repository<Agency> via @InjectRepository; mocked
        // here so resolveAgencyPlan() returns null (treated as BASIC plan).
        { provide: getRepositoryToken(Company), useValue: mockCompanyRepository },
        { provide: getRepositoryToken(RefreshToken), useValue: mockRefreshTokenRepository },
      ],
    }).compile();
    authService = module.get(AuthService);
  });

  describe('login', () => {
    it('returns tokens when credentials are valid', async () => {
      mockPasswordService.verify.mockResolvedValue(true);
      mockUsersService.findByIdentifier.mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await authService.login({ identifier: 'awa@opep.test', password: 'secret123' });

      expect(result.access_token).toBe('access-token');
      expect(result.refresh_token).toBe('refresh-token');
      expect(result.user.id).toBe('u-1');
      expect(result.user.firstName).toBe('Awa');
      expect(mockUsersService.findByIdentifier).toHaveBeenCalledWith('awa@opep.test');
    });

    it('throws Unauthorized when user not found', async () => {
      mockUsersService.findByIdentifier.mockResolvedValue(null);
      await expect(
        authService.login({ identifier: 'ghost@opep.test', password: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws Unauthorized when password is invalid', async () => {
      mockPasswordService.verify.mockResolvedValue(false);
      mockUsersService.findByIdentifier.mockResolvedValue(mockUser);
      await expect(
        authService.login({ identifier: 'awa@opep.test', password: 'wrong-pw' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws Forbidden when account is locked', async () => {
      mockLoginAttemptService.isLocked.mockResolvedValue({ locked: true, remainingSeconds: 300 });
      await expect(
        authService.login({ identifier: 'locked@opep.test', password: 'any' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('upgrades password hash when needsRehash is true', async () => {
      mockPasswordService.verify.mockResolvedValue(true);
      mockPasswordService.needsRehash.mockReturnValue(true);
      mockPasswordService.hash.mockResolvedValue('argon2-hash');
      mockUsersService.findByIdentifier.mockResolvedValue(mockUser);
      mockUsersService.update.mockResolvedValue({ ...mockUser, passwordHash: 'argon2-hash' });

      const result = await authService.login({ identifier: 'awa@opep.test', password: 'secret123' });

      expect(result.access_token).toBe('mock-access-token');
      expect(mockPasswordService.hash).toHaveBeenCalledWith('secret123');
      expect(mockUsersService.update).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('returns tokens when user is created', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await authService.register({} as any);

      expect(result.access_token).toBe('mock-access-token');
      expect(result.user.id).toBe('u-1');
      expect(mockUsersService.create).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('hashes and updates the password for known phone', async () => {
      mockUsersService.findByPhone.mockResolvedValue(mockUser);
      mockPasswordService.hash.mockResolvedValue('new-hash');
      mockUsersService.update.mockResolvedValue({ ...mockUser, passwordHash: 'new-hash' });

      const result = await authService.resetPassword('670000001', 'newSecret123');

      expect(result.message).toContain('réinitialisé');
      expect(mockUsersService.update).toHaveBeenCalledWith('u-1', { passwordHash: 'new-hash' });
    });

    it('throws NotFound when phone is unknown', async () => {
      mockUsersService.findByPhone.mockResolvedValue(null);
      await expect(authService.resetPassword('000', 'newSecret123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('refreshToken', () => {
    it('returns new tokens for a valid refresh token', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await authService.refreshToken('valid-token');
      expect(result.access_token).toBe('mock-access-token');
    });

    it('throws Unauthorized for invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('bad signature');
      });
      await expect(authService.refreshToken('bad')).rejects.toThrow(UnauthorizedException);
    });

    it('throws Unauthorized for revoked token', async () => {
      mockJwtService.verify.mockReturnValue({ sub: 'u-1' });
      mockRefreshTokenRepository.findOne.mockResolvedValue(null);
      await expect(authService.refreshToken('revoked-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('revokes a specific refresh token', async () => {
      const result = await authService.logout('u-1', 'specific-token');
      expect(result.message).toContain('Déconnexion');
    });

    it('revokes all refresh tokens for the user', async () => {
      const result = await authService.logout('u-1');
      expect(result.message).toContain('Déconnexion');
    });
  });

  describe('changePassword', () => {
    it('updates password when current password is correct', async () => {
      mockUsersService.findByIdentifierByUserId.mockResolvedValue(mockUser);
      mockPasswordService.verify.mockResolvedValue(true);
      mockPasswordService.hash.mockResolvedValue('new-hash');

      const result = await authService.changePassword('u-1', 'current-pw', 'new-pw');
      expect(result.message).toContain('modifié');
      expect(mockUsersService.update).toHaveBeenCalled();
    });

    it('throws Unauthorized when current password is wrong', async () => {
      mockUsersService.findByIdentifierByUserId.mockResolvedValue(mockUser);
      mockPasswordService.verify.mockResolvedValue(false);
      await expect(
        authService.changePassword('u-1', 'wrong-pw', 'new-pw'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('returns user profile for valid user', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);
      const profile = await authService.getProfile('u-1');
      expect(profile.id).toBe('u-1');
      expect(profile.firstName).toBe('Awa');
      expect(profile.lastName).toBe('Ndiaye');
    });

    it('throws NotFound for unknown user', async () => {
      mockUsersService.findById.mockResolvedValue(null);
      await expect(authService.getProfile('ghost')).rejects.toThrow(NotFoundException);
    });
  });
});
