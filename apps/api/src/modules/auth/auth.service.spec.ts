import { Test } from '@nestjs/testing';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/services/users.service';

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
    findById: jest.fn(),
    findByPhone: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService: any = {
    sign: jest.fn().mockReturnValue('mock-access-token'),
    verify: jest.fn(),
  };

  const mockConfigService: any = {
    get: jest.fn((key: string, def?: any) => def ?? 'test-secret'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    authService = module.get(AuthService);
  });

  describe('login', () => {
    it('returns tokens when credentials are valid', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockUsersService.findByIdentifier.mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await authService.login({ identifier: 'awa@opep.test', password: 'secret123' });

      expect(result.access_token).toBe('access-token');
      expect(result.refresh_token).toBe('refresh-token');
      expect(result.user.id).toBe('u-1');
      expect(mockUsersService.findByIdentifier).toHaveBeenCalledWith('awa@opep.test');
    });

    it('throws Unauthorized when user not found', async () => {
      mockUsersService.findByIdentifier.mockResolvedValue(null);
      await expect(
        authService.login({ identifier: 'ghost@opep.test', password: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws Unauthorized when password is invalid', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      mockUsersService.findByIdentifier.mockResolvedValue(mockUser);
      await expect(
        authService.login({ identifier: 'awa@opep.test', password: 'wrong-pw' }),
      ).rejects.toThrow(UnauthorizedException);
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
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('new-hash' as never);
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
  });
});
