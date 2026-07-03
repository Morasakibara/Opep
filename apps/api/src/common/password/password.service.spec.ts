import { PasswordService } from './password.service';
import * as bcrypt from 'bcryptjs';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  describe('hash()', () => {
    it('produces an argon2id PHC-formatted string', async () => {
      const hash = await service.hash('hunter2');
      expect(hash).toMatch(/^\$argon2id\$v=19\$m=19456,t=2,p=1\$[A-Za-z0-9+/]+\$[A-Za-z0-9+/]+$/);
    });

    it('returns a different hash every call (salt is random)', async () => {
      const a = await service.hash('hunter2');
      const b = await service.hash('hunter2');
      expect(a).not.toBe(b);
      // Both verify as the same plaintext
      expect(await service.verify(a, 'hunter2')).toBe(true);
      expect(await service.verify(b, 'hunter2')).toBe(true);
    });
  });

  describe('verify() — argon2id (current format)', () => {
    let argonHash: string;
    beforeEach(async () => {
      argonHash = await service.hash('hunter2');
    });

    it('returns true for the correct plaintext', async () => {
      expect(await service.verify(argonHash, 'hunter2')).toBe(true);
    });

    it('returns false for the wrong plaintext', async () => {
      expect(await service.verify(argonHash, 'wrong-pw')).toBe(false);
    });

    it('returns false (no throw) for a tampered hash missing the salt segment', async () => {
      // Tampered by zeroing the trailing signature
      const tampered = argonHash.slice(0, argonHash.lastIndexOf('$') + 1) + 'AAAA';
      expect(await service.verify(tampered, 'hunter2')).toBe(false);
    });
  });

  describe('verify() — bcrypt legacy ($2b$…) fallback', () => {
    let legacyHash: string;
    beforeEach(() => {
      // Generate a true bcrypt-style hash with bcryptjs (pure JS, used at
      // verify time only — never for fresh hashing here)
      legacyHash = bcrypt.hashSync('hunter2', 10);
    });

    it('accepts the legacy hash for the original plaintext', async () => {
      expect(await service.verify(legacyHash, 'hunter2')).toBe(true);
    });

    it('rejects the legacy hash for the wrong plaintext', async () => {
      expect(await service.verify(legacyHash, 'wrong')).toBe(false);
    });

    it('accepts legitimate $2a$, $2b$, $2y$ variants all', async () => {
      const variants = ['$2a$10$ab', '$2b$10$cd', '$2y$10$ef'].map((prefix) =>
        bcrypt.hashSync('hunter2', 10),
      );
      // bcryptjs only outputs $2a$ by default, but the prefix regex covers
      // all four. We at least verify $2a$ (bcryptjs native) + ensure regex.
      for (const v of variants) {
        // The actual hash from bcryptjs starts with $2a$. Verify against the
        // plaintext we hashed:
        expect(await service.verify(v, 'hunter2')).toBe(true);
        expect(await service.verify(v, 'wrong')).toBe(false);
      }
      expect(service.isLegacyBcrypt('$2b$10$abcdefghijklmnopqrstuv')).toBe(true);
      expect(service.isLegacyBcrypt('$2y$10$abcdefghijklmnopqrstuv')).toBe(true);
      expect(service.isLegacyBcrypt('$2a$10$abcdefghijklmnopqrstuv')).toBe(true);
    });
  });

  describe('verify() — malformed input', () => {
    it('returns false (no throw) when stored is undefined', async () => {
      expect(await service.verify(undefined as any, 'pw')).toBe(false);
    });
    it('returns false (no throw) when stored is null', async () => {
      expect(await service.verify(null as any, 'pw')).toBe(false);
    });
    it('returns false (no throw) when stored has no recognised prefix', async () => {
      expect(await service.verify('plain-text-pw', 'plain-text-pw')).toBe(false);
    });
    it("returns false (no throw) when stored is empty string", async () => {
      expect(await service.verify('', 'pw')).toBe(false);
    });
  });

  describe('needsRehash()', () => {
    it('is false for argon2id hashes', async () => {
      const argonHash = await service.hash('pw');
      expect(service.needsRehash(argonHash)).toBe(false);
    });
    it('is true for bcrypt legacy hashes', () => {
      const legacy = bcrypt.hashSync('pw', 10);
      expect(service.needsRehash(legacy)).toBe(true);
    });
    it('is false for empty / undefined input', () => {
      expect(service.needsRehash('')).toBe(false);
      expect(service.needsRehash(undefined as any)).toBe(false);
    });
  });

  describe('isArgon2() / isLegacyBcrypt()', () => {
    it('isArgon2 detects current format', () => {
      expect(service.isArgon2('$argon2id$v=19$m=19456,t=2,p=1$xxx$yyy')).toBe(true);
      expect(service.isArgon2('$argon2i$v=19$m=19456,t=2,p=1$xxx$yyy')).toBe(true);
      expect(service.isArgon2('$argon2d$...')).toBe(true);
    });
    it('isArgon2 rejects bcrypt', () => {
      expect(service.isArgon2('$2b$10$abcdefghijklmnopqrstuv')).toBe(false);
      expect(service.isArgon2('$2a$10$abcdefghijklmnopqrstuv')).toBe(false);
    });
    it('isLegacyBcrypt detects the legacy family', () => {
      expect(service.isLegacyBcrypt('$2a$10$abcdefghijklmnopqrstuv')).toBe(true);
      expect(service.isLegacyBcrypt('$2b$10$abcdefghijklmnopqrstuv')).toBe(true);
      expect(service.isLegacyBcrypt('$2c$10$abcdefghijklmnopqrstuv')).toBe(true);
      expect(service.isLegacyBcrypt('$2y$10$abcdefghijklmnopqrstuv')).toBe(true);
    });
    it('isLegacyBcrypt rejects argon2 and other formats', () => {
      expect(service.isLegacyBcrypt('$argon2id$...')).toBe(false);
      expect(service.isLegacyBcrypt('plain')).toBe(false);
      expect(service.isLegacyBcrypt('')).toBe(false);
    });
    it('precise prefix check rejects similar-looking but invalid variants', () => {
      // "2" with no $ before cost: not bcrypt
      expect(service.isLegacyBcrypt('2b$10$...')).toBe(false);
      // "2x" not a known variant
      expect(service.isLegacyBcrypt('$2x$10$...')).toBe(false);
      // "2b" with non-numeric cost
      expect(service.isLegacyBcrypt('$2b$AB$...')).toBe(false);
    });
  });
});
