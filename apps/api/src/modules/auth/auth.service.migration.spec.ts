import { Test } from '@nestjs/testing';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UsersService } from '../users/services/users.service';
import { PasswordService } from '../../common/password/password.service';
import { LoginAttemptService } from './services/login-attempt.service';
import { Agency } from '../agencies/entities/agency.entity';
import { RefreshToken } from './entities/refresh-token.entity';

/**
 * NOTE: Real PasswordService end-to-end coverage (argon2id hash/verify,
 * bcryptjs legacy verify, regex detectors, OWASP arg) lives in
 * `apps/api/src/common/password/password.service.spec.ts`.
 *
 * Here we ONLY test the AuthService orchestration: that login /
 * changePassword / resetPassword invoke PasswordService at the right
 * points, route legacy users through the rehash update path, and stay
 * resilient when that update fails. Mocking PasswordService lets these
 * tests run cleanly without loading the native argon2 binding in the
 * Jest sandbox (which crashes on some Windows / musl setups).
 */
describe('AuthService — password-hash migration flow (PasswordService mocked)', () => {
  // Stable test fixtures. The exact bytes are irrelevant — what matters is
  // that the mock PasswordService is driven by the passwordHash property of
  // each fixture.
  const ARGON_HASH =
    '$argon2id$v=19$m=19456,t=2,p=1$ZHVtbXlzYWx0ZHVtbXk$' +
    'c2VjcmV0aGFzaGFmdGVybWluZWQwMTIzNDU2Nzg5MA';
  const NEW_ARGON_HASH =
    '$argon2id$v=19$m=19456,t=2,p=1$bmV3c2FsdG5ld3NhbHQ$' +
    'c2VjcmV0X2hhc2hfYWZ0ZXJfdXBncmFkZTAxMjM0NTY3ODkw';

  const argonUser = {
    id: 'u-argon',
    firstName: 'Awa',
    lastName: 'Ndiaye',
    phone: '670000010',
    email: 'argon@opep.test',
    passwordHash: ARGON_HASH, // already migrated — needsRehash = false
    role: 'CLIENT',
    agencyId: null,
    isActive: true,
    preferredLanguage: 'fr',
    notificationChannel: 'SMS',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const legacyUser = {
    ...argonUser,
    id: 'u-legacy',
    email: 'legacy@opep.test',
    phone: '670000011',
    passwordHash: '$2a$10$abcdefghijklmnopqrstuv0123456789012345678901234567', // legacy
  };

  let authService: AuthService;
  let mockUsersService: any;
  let mockJwtService: any;
  let mockPasswordService: any;
  let mockLoginAttemptService: any;
  let mockRefreshTokenRepository: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockUsersService = {
      findByIdentifier: jest.fn(),
      findByIdentifierByUserId: jest.fn(),
      findById: jest.fn(),
      findByPhone: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-access-token'),
      verify: jest.fn(),
    };

    mockPasswordService = {
      verify: jest.fn(),
      hash: jest.fn(),
      needsRehash: jest.fn(),
      isArgon2: jest.fn(),
      isLegacyBcrypt: jest.fn(),
    };

    mockLoginAttemptService = {
      isLocked: jest.fn().mockResolvedValue({ locked: false, remainingSeconds: 0 }),
      recordFailedAttempt: jest.fn().mockResolvedValue(1),
      clearAttempts: jest.fn().mockResolvedValue(undefined),
    };

    mockRefreshTokenRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findOne: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: { get: (_k: string, d?: any) => d ?? 'test-secret' } },
        { provide: LoginAttemptService, useValue: mockLoginAttemptService },
        { provide: PasswordService, useValue: mockPasswordService },
        { provide: getRepositoryToken(Agency), useValue: { findOne: jest.fn().mockResolvedValue(null) } },
        { provide: getRepositoryToken(RefreshToken), useValue: mockRefreshTokenRepository },
      ],
    }).compile();

    authService = module.get(AuthService);

    // Sensible defaults — overridden per test
    mockPasswordService.verify.mockResolvedValue(true);
    mockPasswordService.needsRehash.mockReturnValue(false);
    mockPasswordService.hash.mockResolvedValue(NEW_ARGON_HASH);
  });

  describe('login — current argon2id user', () => {
    it('authenticates without triggering rehash', async () => {
      mockUsersService.findByIdentifier.mockResolvedValue(argonUser);

      const result = await authService.login({
        identifier: argonUser.email,
        password: 'whatever-the-plaintext-was',
      });

      expect(result.access_token).toBe('mock-access-token');
      expect(result.refresh_token).toBe('mock-access-token');
      expect(result.user.id).toBe(argonUser.id);

      // PasswordService was consulted (verify + needsRehash), but hash was NOT
      expect(mockPasswordService.verify).toHaveBeenCalledWith(
        argonUser.passwordHash,
        'whatever-the-plaintext-was',
      );
      expect(mockPasswordService.needsRehash).toHaveBeenCalledWith(argonUser.passwordHash);
      expect(mockPasswordService.hash).not.toHaveBeenCalled();
      expect(mockUsersService.update).not.toHaveBeenCalled();
    });
  });

  describe('login — legacy bcrypt user', () => {
    it('authenticates AND transparently upgrades the legacy hash', async () => {
      mockUsersService.findByIdentifier.mockResolvedValue(legacyUser);
      mockPasswordService.needsRehash.mockReturnValue(true);

      // Snapshot BEFORE login: auth.service runs `user.passwordHash = newHash`
      // in the success path, and findByIdentifier() returns the SAME reference
      // as legacyUser. The in-place mutation would otherwise rewrite the
      // fixture's passwordHash and break any later `toHaveBeenCalledWith(...)`
      // assertion that compares against `legacyUser.passwordHash`.
      const expectedLegacyHash = legacyUser.passwordHash;
      const expectedLegacyId = legacyUser.id;

      const result = await authService.login({
        identifier: legacyUser.email,
        password: 'any-plain-value',
      });

      expect(result.access_token).toBe('mock-access-token');
      expect(result.user.id).toBe(legacyUser.id);

      // The full rehash chain ran exactly once, end to end
      expect(mockPasswordService.needsRehash).toHaveBeenCalledWith(expectedLegacyHash);
      expect(mockPasswordService.hash).toHaveBeenCalledTimes(1);
      expect(mockUsersService.update).toHaveBeenCalledTimes(1);

      const [updatedId, partial] = mockUsersService.update.mock.calls[0];
      expect(updatedId).toBe(expectedLegacyId);
      expect(partial.passwordHash).toBe(NEW_ARGON_HASH);
    });

    it('still authenticates if the rehash write FAILS (resilience)', async () => {
      mockUsersService.findByIdentifier.mockResolvedValue(legacyUser);
      mockPasswordService.needsRehash.mockReturnValue(true);
      mockUsersService.update.mockRejectedValue(new Error('DB connection lost'));

      // Login must NOT throw — graceful fallback
      const result = await authService.login({
        identifier: legacyUser.email,
        password: 'anything',
      });

      expect(result.access_token).toBe('mock-access-token');
      expect(mockUsersService.update).toHaveBeenCalledTimes(1); // we DID try; it failed
    });

    it('rejects (no migration) on wrong password against legacy hash', async () => {
      mockUsersService.findByIdentifier.mockResolvedValue(legacyUser);
      mockPasswordService.verify.mockResolvedValue(false); // wrong password

      await expect(
        authService.login({ identifier: legacyUser.email, password: 'wrong-pw-nope' }),
      ).rejects.toThrow(UnauthorizedException);

      // verify returned false → short-circuit BEFORE migration logic
      expect(mockPasswordService.needsRehash).not.toHaveBeenCalled();
      expect(mockPasswordService.hash).not.toHaveBeenCalled();
      expect(mockUsersService.update).not.toHaveBeenCalled();
    });
  });

  describe('login — unknown identifier (defensive)', () => {
    it('throws UnauthorizedException when findByIdentifier returns null', async () => {
      mockUsersService.findByIdentifier.mockResolvedValue(null);

      await expect(
        authService.login({ identifier: 'nobody@opep.test', password: 'anything' }),
      ).rejects.toThrow(UnauthorizedException);

      // Short-circuit BEFORE the verify/rehash path
      expect(mockPasswordService.verify).not.toHaveBeenCalled();
      expect(mockPasswordService.needsRehash).not.toHaveBeenCalled();
      expect(mockPasswordService.hash).not.toHaveBeenCalled();
      expect(mockUsersService.update).not.toHaveBeenCalled();
    });
  });

  describe('login — malformed hash (defensive)', () => {
    it('returns Unauthorized (no crash) when user.passwordHash is null', async () => {
      const weirdUser = { ...argonUser, passwordHash: null };
      mockUsersService.findByIdentifier.mockResolvedValue(weirdUser);
      mockPasswordService.verify.mockResolvedValue(false);

      await expect(
        authService.login({ identifier: weirdUser.email, password: 'whatever' }),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.update).not.toHaveBeenCalled();
    });

    it('returns Unauthorized (no crash) when user.passwordHash is an empty string', async () => {
      const weirdUser = { ...argonUser, passwordHash: '' };
      mockUsersService.findByIdentifier.mockResolvedValue(weirdUser);
      mockPasswordService.verify.mockResolvedValue(false);

      await expect(
        authService.login({ identifier: weirdUser.email, password: 'whatever' }),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.update).not.toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('hashes the new password via PasswordService (argon2) and updates', async () => {
      mockUsersService.findByIdentifierByUserId.mockResolvedValue(argonUser);

      const out = await authService.changePassword('u-argon', 'old-pw', 'new-strong-pw');

      expect(out.message).toMatch(/modifié/i);
      expect(mockPasswordService.verify).toHaveBeenCalledWith(argonUser.passwordHash, 'old-pw');
      expect(mockPasswordService.hash).toHaveBeenCalledWith('new-strong-pw');
      expect(mockUsersService.update).toHaveBeenCalledWith('u-argon', {
        passwordHash: NEW_ARGON_HASH,
      });
    });

    it('rejects when currentPassword does not verify', async () => {
      mockUsersService.findByIdentifierByUserId.mockResolvedValue(argonUser);
      mockPasswordService.verify.mockResolvedValue(false);

      await expect(
        authService.changePassword('u-argon', 'WRONG', 'new-pw'),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockPasswordService.hash).not.toHaveBeenCalled();
      expect(mockUsersService.update).not.toHaveBeenCalled();
    });

    it('throws NotFound when the user id is unknown', async () => {
      mockUsersService.findByIdentifierByUserId.mockResolvedValue(null);

      await expect(
        authService.changePassword('u-ghost', 'old', 'new'),
      ).rejects.toThrow(NotFoundException);
      expect(mockPasswordService.verify).not.toHaveBeenCalled();
      expect(mockPasswordService.hash).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('hashes the new password via PasswordService (argon2) and updates', async () => {
      mockUsersService.findByPhone.mockResolvedValue(legacyUser);

      const out = await authService.resetPassword('670000011', 'freshly-chosen-pw');

      expect(out.message).toMatch(/réinitialisé/i);
      expect(mockPasswordService.hash).toHaveBeenCalledWith('freshly-chosen-pw');
      expect(mockUsersService.update).toHaveBeenCalledWith(legacyUser.id, {
        passwordHash: NEW_ARGON_HASH,
      });
    });

    it('throws NotFound when no user owns the phone', async () => {
      mockUsersService.findByPhone.mockResolvedValue(null);

      await expect(
        authService.resetPassword('670009999', 'new'),
      ).rejects.toThrow(NotFoundException);
      expect(mockPasswordService.hash).not.toHaveBeenCalled();
    });
  });
});

