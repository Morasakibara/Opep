import { Controller, Post, HttpCode, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { exec } from 'child_process';
import { join } from 'path';
import { promisify } from 'util';


const execAsync = promisify(exec);

/**
 * Seed controller — lance le script de seed complet pour initialiser
 * les données de démonstration (compagnies, centres, utilisateurs, etc.).
 *
 * Endpoint: POST /api/seed (désactivé en production)
 * Usage:    curl -X POST http://localhost:3000/api/v1/seed -H 'X-Requested-With: XMLHttpRequest'
 *
 * Protégé par le CsrfOriginGuard global. Outil de développement uniquement.
 */
@Controller('seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);

  @Post()
  @HttpCode(HttpStatus.OK)
  @SkipThrottle()
  async runSeed() {
    // Bloquer en production
    if (process.env.NODE_ENV === 'production') {
      throw new NotFoundException('Seed endpoint is disabled in production');
    }

    // From dist/modules/seed/ → need to go up to apps/api/
    // __dirname in compiled code: dist/modules/seed/
    // join(__dirname, '../../../') = apps/api/
    const cwd = join(__dirname, '../../../');
    const seedScript = 'src/seed.ts'; // relative to cwd

    this.logger.log('Starting seed from: ' + join(cwd, seedScript));

    try {
      const { stdout, stderr } = await execAsync(
        `npx ts-node -r tsconfig-paths/register "${seedScript}"`,
        {
          cwd,
          timeout: 120_000,
          maxBuffer: 1024 * 1024,
        },
      );

      // Also seed monitoring errors in the in-memory store
      // (the seed.ts script already seeds them to DB)
      const allOutput = (stdout || '') + (stderr || '');
      const lines = allOutput.trim().split('\n').filter(Boolean);
      const lastLines = lines.slice(-15).join('\n');

      this.logger.log('Seed completed successfully');
      return { seeded: true, summary: lastLines };
    } catch (err: any) {
      this.logger.error('Seed failed: ' + (err.stderr || err.message));
      return { seeded: false, error: err.stderr || err.message };
    }
  }
}
