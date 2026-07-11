import { Global, Module } from '@nestjs/common';
import { PasswordService } from './password.service';

/**
 * @Global() so AuthService and UsersService can both inject PasswordService
 * without importing this module directly — keeps the dependency graph
 * acyclic (otherwise AuthModule ↔ UsersModule import each other for the
 * same service). One instance per app is correct: hashing parameters are
 * shared, and the cache of class references is trivial.
 */
@Global()
@Module({
  providers: [PasswordService],
  exports: [PasswordService],
})
export class PasswordModule {}
