import * as fs from 'fs';
import * as path from 'path';

describe('DriversController throttle configuration', () => {
  const source = fs.readFileSync(
    path.join(__dirname, 'drivers.controller.ts'),
    'utf8',
  );

  const extractMethodBlock = (methodName: string): string => {
    const idx = source.indexOf(`async ${methodName}(`) !== -1
      ? source.indexOf(`async ${methodName}(`)
      : source.indexOf(`${methodName}(`);
    if (idx < 0) return '';
    const slice = source.slice(Math.max(0, idx - 400), idx);
    return slice;
  };

  it('rate is throttled at 30/minute', () => {
    const block = extractMethodBlock('rate');
    expect(block).toMatch(/@Throttle\s*\(\s*\{\s*short:\s*\{\s*limit:\s*30,\s*ttl:\s*60000\s*\}\s*\}\s*\)/);
  });

  it('findAll has no @Throttle (handled by global guard)', () => {
    const block = extractMethodBlock('findAll');
    expect(block).not.toMatch(/@Throttle\s*\(/);
  });

  it('findOne has no @Throttle', () => {
    const block = extractMethodBlock('findOne');
    expect(block).not.toMatch(/@Throttle\s*\(/);
  });

  it('imports Throttle from @nestjs/throttler', () => {
    expect(source).toMatch(
      /import\s*\{\s*[^}]*\bThrottle\b[^}]*\}\s*from\s*['"]@nestjs\/throttler['"]/,
    );
  });

  it('uses JwtAuthGuard, RolesGuard, SubscriptionGuard', () => {
    expect(source).toMatch(/@UseGuards\s*\(\s*JwtAuthGuard\s*,\s*RolesGuard\s*,\s*SubscriptionGuard\s*\)/);
  });
});
