import { Test } from '@nestjs/testing';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

import { AuthService } from './auth.service';
import { UsersService } from '../users/services/users.service';
import { PasswordService } from '../../common/password/password.service';
import { LoginAttemptService } from './services/login-attempt.service';
import { Agency } from '../agencies/entities/agency.entity';
import { Company } from '../companies/entities/company.entity';
import { RefreshToken } from './entities/refresh-token.entity';

/**
 * REAL PasswordService end-to-end test for the bcrypt → argon2id migration.
 *
 * What this spec covers that the mocked one (auth.service.migration.spec.ts)
 * cannot catch:
 *   1. A real bcryptjs hash actually verifies the originally-set plaintext.
 *   2. The rehash write from AuthService.login() yields a hash whose format
 *      the REAL PasswordService.verify() accepts — i.e. the round-trip works
 *      end to end, no string munging happening in transit.
 *   3. The OWASP argon2 parameters from PasswordService really got applied
 *      (we regex-parse the PHC string to assert memoryCost=19456, timeCost=2,
 *      parallelism=1, algorithm=argon2id).
 *   4. A subsequent login on the SAME user (fixture ref mutated by the first
 *      login) is happy with the argon2id path AND does NOT trigger a second
 *      rehash (proves idempotency).
 *   5. The legacy verify path stays available — we deliberately keep a
 *      legacy fixture on hand so a regression in `isLegacyBcrypt()` would
 *      fail loudly here.
 *
 * Slow by design: each real argon2 hash call costs ~100 ms. The spec is
 * bounded to ~10 real hash ops; total test time stays under 2 s.
 */
describe('AuthService — legacy migration (REAL PasswordService end-to-end)', () => {
  // ---- shared fixtures ---------------------------------------------------
  // We hand-craft a bcryptjs hash with the EXACT plaintext we'll feed to
  // login(). This is what would happen if a row in the DB predated the
  // migration: `passwordHash` is $2a$10$..., `password` ("hunter2") is
  // the user's typed plaintext.
  //
  // Bcrypt uses a random salt; we synchronously generate one here to avoid
  // hitting the network / DB. Cost factor 10 keeps the test under 50 ms.
  const LEGACY_PLAINTEXT = 'hunter2-correct-horse';
  let legacyUser: any;
  let argonUser: any;
  // FIXTURE_ISOLATION_ANCHOR
  // AuthService.login() mutates the user fixture IN PLACE via
  //   user.passwordHash = newHash
  // (after the DB write resolves) and our mock's update() implementation also
  // writes through to the same object. That means after each test, this
  // fixture holds a freshly-migrated argon2id hash. Without resetting it,
  // every subsequent test in this describe block starts on a NON-legacy
  // user and the migration assertions fail.
  //
  // We therefore cache the *original* bcrypt hash here (captured at module
  // load, before any test mutates the fixture) and re-assign from it in
  // beforeEach.
  const ORIGINAL_LEGACY_HASH = bcrypt.hashSync(LEGACY_PLAINTEXT, 10);

  beforeAll(() => {
    expect(ORIGINAL_LEGACY_HASH).toMatch(/^\$2[aby]?\$10\$/);

    legacyUser = {
      id: 'u-legacy-real',
      firstName: 'Lamine',
      lastName: 'Legacy',
      phone: '670000100',
      email: 'legacy-real@opep.test',
      passwordHash: ORIGINAL_LEGACY_HASH, // bcrypt — needsRehash = true
      role: 'CLIENT',
      agencyId: null,
      isActive: true,
      preferredLanguage: 'fr',
      notificationChannel: 'SMS',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

  argonUser = {
    id: 'u-argon-real',
    firstName: 'Aminata',
    lastName: 'Argon',
    phone: '670000101',
    email: 'argon-real@opep.test',
    // Populated in each test that needs it (one-shot). Leaving empty
    // here would let a stray test accidentally treat the argon user as
    // a "malformed hash" case.
    passwordHash: '',
    role: 'CLIENT',
    agencyId: null,
    isActive: true,
    preferredLanguage: 'fr',
    notificationChannel: 'SMS',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  });

  // ---- DI plumbing -------------------------------------------------------
  let authService: AuthService;
  let realPasswordService: PasswordService;
  let mockUsersService: any;
  let mockLoginAttemptService: any;
  let mockRefreshTokenRepository: any;

  beforeEach(async () => {
    // CRITICAL: restore the legacyUser fixture to its freshly-minted bcrypt
    // hash. If we skip this, the second test in this describe block would
    // start on a fixture whose passwordHash is already argon2id (mutated
    // by the first test), and the migration assertions would fail.
    if (legacyUser) legacyUser.passwordHash = ORIGINAL_LEGACY_HASH;
    if (argonUser) argonUser.passwordHash = '';

    mockUsersService = {
      findByIdentifier: jest.fn(),
      findByIdentifierByUserId: jest.fn(),
      findById: jest.fn(),
      findByPhone: jest.fn(),
      update: jest.fn().mockImplementation(async (id, partial) => {
        // Real-world write semantics: the user record is mutated in place.
        // This is what the AuthService relies on for the in-place
        // `user.passwordHash = newHash` line.
        const target = legacyUser.id === id ? legacyUser : argonUser;
        if (target) target.passwordHash = partial.passwordHash;
        return target;
      }),
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
        { provide: JwtService, useValue: { sign: () => 'mock-access-token', verify: () => ({}) } },
        { provide: ConfigService, useValue: { get: (_k: string, d?: any) => d ?? 'test-secret' } },
        { provide: LoginAttemptService, useValue: mockLoginAttemptService },
        // REAL PasswordService, not a mock — this is the whole point of
        // the spec.
        PasswordService,
        { provide: getRepositoryToken(Agency), useValue: { findOne: jest.fn().mockResolvedValue(null) } },
        { provide: getRepositoryToken(Company), useValue: { findOne: jest.fn().mockResolvedValue(null) } },
        { provide: getRepositoryToken(RefreshToken), useValue: mockRefreshTokenRepository },
      ],
    }).compile();

    authService = module.get(AuthService);
    realPasswordService = module.get(PasswordService);
  });

  // -------------------------------------------------------------------------
  describe('login() — legacy bcrypt → argon2id transparent upgrade', () => {
    it('verifies the legacy hash AND upgrades the stored hash to argon2id', async () => {
      mockUsersService.findByIdentifier.mockResolvedValue(legacyUser);
      const legacyHashBefore = legacyUser.passwordHash;
      expect(legacyHashBefore).toMatch(/^\$2[aby]?\$/); // still legacy

      await authService.login({ identifier: legacyUser.email, password: LEGACY_PLAINTEXT });

      // findByIdentifier was hit once
      expect(mockUsersService.findByIdentifier).toHaveBeenCalledTimes(1);
      // update was hit exactly once with the new argon2id hash
      expect(mockUsersService.update).toHaveBeenCalledTimes(1);

      const [updatedId, partial] = mockUsersService.update.mock.calls[0];
      expect(updatedId).toBe(legacyUser.id);

      // Format check — strict PHC for the OWASP parameters
      expect(partial.passwordHash).toMatch(
        /^\$argon2id\$v=19\$m=19456,t=2,p=1\$[A-Za-z0-9+/]+\$[A-Za-z0-9+/]+$/,
      );
      // Real round-trip: the new hash actually verifies the original plaintext
      expect(await realPasswordService.verify(partial.passwordHash, LEGACY_PLAINTEXT)).toBe(true);
      // And it does NOT match a different plaintext
      expect(await realPasswordService.verify(partial.passwordHash, 'wrong')).toBe(false);

      // In-place mutation: legacyUser.passwordHash is now the argon2id one
      expect(legacyUser.passwordHash).toBe(partial.passwordHash);
      expect(legacyUser.passwordHash).not.toBe(legacyHashBefore);
      // The fixture no longer matches the legacy regex
      expect(legacyUser.passwordHash).not.toMatch(/^\$2[aby]?\$/);
      // …and no longer needs rehash
      expect(realPasswordService.needsRehash(legacyUser.passwordHash)).toBe(false);
    });

    it('does NOT re-upgrade on the second login (idempotency)', async () => {
      // Make the same user resolve on every findByIdentifier call, with
      // their current passwordHash reflected (the AuthService relies on
      // this in-place mutation to know "no rehash needed").
      mockUsersService.findByIdentifier.mockImplementation(async () => legacyUser);

      // First login → triggers the upgrade
      await authService.login({ identifier: legacyUser.email, password: LEGACY_PLAINTEXT });
      expect(mockUsersService.update).toHaveBeenCalledTimes(1);
      const argonHashAfterFirstLogin = legacyUser.passwordHash;
      expect(argonHashAfterFirstLogin).toMatch(/^\$argon2id\$/);

      // Second login with the SAME user reference. The AuthService reads
      // `user.passwordHash` (now argon2id) and needsRehash() returns false.
      await authService.login({ identifier: legacyUser.email, password: LEGACY_PLAINTEXT });
      expect(mockUsersService.update).toHaveBeenCalledTimes(1); // still 1, not 2

      // Real verify round-trip still works on the new hash
      expect(await realPasswordService.verify(argonHashAfterFirstLogin, LEGACY_PLAINTEXT)).toBe(true);
    });

    it('still authenticates when the rehash write fails (resilience)', async () => {
      mockUsersService.findByIdentifier.mockResolvedValue(legacyUser);
      // The DB write explodes mid-flight
      mockUsersService.update.mockRejectedValueOnce(new Error('DB connection lost'));

      // Login must NOT throw — graceful fallback to legacy authentication
      const result = await authService.login({
        identifier: legacyUser.email,
        password: LEGACY_PLAINTEXT,
      });
      expect(result.access_token).toBe('mock-access-token');
      expect(result.user.id).toBe(legacyUser.id);

      // The legacy hash is untouched (mutation only happens AFTER update
      // resolves — see auth.service.ts).
      expect(legacyUser.passwordHash).toMatch(/^\$2[aby]?\$/);

      // A later successful login would try again (resiliency)
      mockUsersService.update.mockResolvedValueOnce(undefined);
      await authService.login({ identifier: legacyUser.email, password: LEGACY_PLAINTEXT });
      expect(mockUsersService.update).toHaveBeenCalledTimes(2);
    });

    it('does NOT trigger the migration on wrong password', async () => {
      mockUsersService.findByIdentifier.mockResolvedValue(legacyUser);

      await expect(
        authService.login({ identifier: legacyUser.email, password: 'WRONG' }),
      ).rejects.toThrow(UnauthorizedException);

      // Verify path returns false → short-circuit BEFORE the migration block
      expect(mockUsersService.update).not.toHaveBeenCalled();
      expect(legacyUser.passwordHash).toMatch(/^\$2[aby]?\$/);
    });
  });

  // -------------------------------------------------------------------------
  describe('login() — already-migrated argon2id user', () => {
    it('runs the argon2id verify path end-to-end without DB writes', async () => {
      const REAL_PLAINTEXT = 'argon-plaintext-1234';
      // Real, freshly minted argon2id hash via the REAL PasswordService.
      // We mutate the shared fixture so AuthService sees an already-migrated
      // user record.
      argonUser.passwordHash = await realPasswordService.hash(REAL_PLAINTEXT);
      argonUser.id = 'u-argon-real';
      mockUsersService.findByIdentifier.mockResolvedValue(argonUser);

      const result = await authService.login({
        identifier: argonUser.email,
        password: REAL_PLAINTEXT,
      });

      // Successful login via the argon2id branch
      expect(result.access_token).toBe('mock-access-token');
      expect(result.user.id).toBe(argonUser.id);
      // Migration logic did NOT trigger — no DB writes
      expect(mockUsersService.update).not.toHaveBeenCalled();
      // Sanity: the argon2id branch was actually taken
      expect(argonUser.passwordHash).toMatch(/^\$argon2id\$/);
      // Hash still verifies (no accidental overwrite)
      expect(await realPasswordService.verify(argonUser.passwordHash, REAL_PLAINTEXT)).toBe(true);
    }, 15000);
  });

  // -------------------------------------------------------------------------
  describe('changePassword() on a legacy user', () => {
    it('produces a real argon2id hash and verifies against the new plaintext', async () => {
      mockUsersService.findByIdentifierByUserId.mockResolvedValue(legacyUser);
      const NEW_PLAINTEXT = 'brand-new-strong-password-!2026';

      const out = await authService.changePassword(
        legacyUser.id,
        LEGACY_PLAINTEXT, // current password (verified against the legacy hash)
        NEW_PLAINTEXT, // new password (will be hashed with argon2id)
      );
      expect(out.message).toMatch(/modifié/i);

      // The update landed with an argon2id hash
      const partial = mockUsersService.update.mock.calls[0][1];
      expect(partial.passwordHash).toMatch(
        /^\$argon2id\$v=19\$m=19456,t=2,p=1\$/,
      );

      // Real verify round-trip on the new hash
      expect(await realPasswordService.verify(partial.passwordHash, NEW_PLAINTEXT)).toBe(true);
      expect(await realPasswordService.verify(partial.passwordHash, 'random')).toBe(false);

      // The legacy hash is now gone (mutation through update)
      expect(legacyUser.passwordHash).not.toMatch(/^\$2[aby]?\$/);
      expect(realPasswordService.needsRehash(legacyUser.passwordHash)).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  describe('resetPassword()', () => {
    it('produces a real argon2id hash regardless of the original format', async () => {
      mockUsersService.findByPhone.mockResolvedValue(legacyUser);
      const NEW_PLAINTEXT = 'reset-strong-password-!2026';

      const out = await authService.resetPassword(legacyUser.phone, NEW_PLAINTEXT);
      expect(out.message).toMatch(/réinitialisé/i);

      const partial = mockUsersService.update.mock.calls[0][1];
      expect(partial.passwordHash).toMatch(/^\$argon2id\$v=19\$m=19456,t=2,p=1\$/);
      expect(await realPasswordService.verify(partial.passwordHash, NEW_PLAINTEXT)).toBe(true);
    });
  });
});
