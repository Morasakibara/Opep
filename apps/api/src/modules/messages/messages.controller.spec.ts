import * as fs from 'fs';
import * as path from 'path';

describe('MessagesController throttle configuration', () => {
  const source = fs.readFileSync(
    path.join(__dirname, 'messages.controller.ts'),
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

  it('create is throttled at 60/minute', () => {
    const block = extractMethodBlock('create');
    expect(block).toMatch(/@Throttle\s*\(\s*\{\s*short:\s*\{\s*limit:\s*60,\s*ttl:\s*60000\s*\}\s*\}\s*\)/);
  });

  it('only create has @Throttle (count check)', () => {
    const matches = source.match(/@Throttle\s*\(/g);
    expect(matches ? matches.length : 0).toBe(1);
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
