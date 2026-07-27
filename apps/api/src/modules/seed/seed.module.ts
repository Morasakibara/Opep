import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';

/**
 * SeedModule — outil de développement uniquement.
 * Lance le script de seed pour initialiser les données de démo.
 * Désactivé en production.
 */
@Module({
  controllers: [SeedController],
})
export class SeedModule {}
