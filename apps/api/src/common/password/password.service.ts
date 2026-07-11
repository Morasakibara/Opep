import { Injectable, Logger } from '@nestjs/common';
import { hash as argon2Hash, verify as argon2Verify, Algorithm } from '@node-rs/argon2';
import * as bcryptLegacy from 'bcryptjs';

/**
 * Argon2id parameters picked from the OWASP Password Storage Cheat Sheet
 * (2024) for "moderate" interactive authentication: 19 MiB memoryCost, 2
 * time iterations, single-threaded. Tuned to keep individual hash operations
 * under 100ms on commodity hardware while keeping offline cracking expensive.
 */
const ARGON2_OPTIONS = {
  algorithm: Algorithm.Argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const;

/**
 * Centralised password handling.
 *
 * Two hash formats coexist in the database during the cutover:
 *   • Modern: $argon2id$v=19$m=19456,t=2,p=1$...$...
 *   • Legacy:  $2b$10$...  (bcrypt with cost factor 10, produced under the
 *                old `bcrypt` Node module that we just removed)
 *
 * The service exposes:
 *   - `hash(plain):             Promise<string>` — produce a current-format hash.
 *   - `verify(stored, plain):   Promise<boolean>` — uniform verify across both
 *     formats. Returns the canonical truthy/falsy.
 *   - `needsRehash(stored):     boolean` — true when the stored hash is legacy
 *     and the caller should re-hash with this service and persist the new
 *     value. Triggers transparent migration on the next successful login.
 *
 * Note: `bcryptjs` is a pure-JS implementation — it has no native bindings
 * and is the ONLY reason we still ship a `bcrypt`-shaped dependency. It is
 * strictly confined to verifying existing legacy hashes; no new hashes are
 * ever produced through it.
 */
@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  async hash(plain: string): Promise<string> {
    return argon2Hash(plain, ARGON2_OPTIONS);
  }

  async verify(storedHash: string, plain: string): Promise<boolean> {
    if (this.isArgon2(storedHash)) {
      try {
        return await argon2Verify(storedHash, plain);
      } catch (err) {
        // Malformed hash or invalid encoding — treat as no match instead of
        // bubbling. Login should never reveal WHY a hash failed.
        this.logger.warn(`argon2 verify failed: ${(err as Error).message}`);
        return false;
      }
    }
    if (this.isLegacyBcrypt(storedHash)) {
      try {
        return bcryptLegacy.compareSync(plain, storedHash);
      } catch (err) {
        this.logger.warn(`bcryptjs verify failed: ${(err as Error).message}`);
        return false;
      }
    }
    return false;
  }

  needsRehash(storedHash: string): boolean {
    return this.isLegacyBcrypt(storedHash);
  }

  isArgon2(storedHash: string): boolean {
    return typeof storedHash === 'string' && storedHash.startsWith('$argon2');
  }

  isLegacyBcrypt(storedHash: string): boolean {
    return (
      typeof storedHash === 'string' &&
      /^\$2[abcy]?\$\d{2}\$/.test(storedHash)
    );
  }
}
