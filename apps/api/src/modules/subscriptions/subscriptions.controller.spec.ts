import * as fs from 'fs';
import * as path from 'path';

describe('SubscriptionsController throttle configuration', () => {
  const source = fs.readFileSync(
    path.join(__dirname, 'subscriptions.controller.ts'),
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

  it('subscribe is throttled at 3/minute', () => {
    const block = extractMethodBlock('subscribe');
    expect(block).toMatch(/@Throttle\s*\(\s*\{\s*short:\s*\{\s*limit:\s*3,\s*ttl:\s*60000\s*\}\s*\}\s*\)/);
  });

  it('only subscribe has @Throttle (count check)', () => {
    const matches = source.match(/@Throttle\s*\(/g);
    expect(matches ? matches.length : 0).toBe(1);
  });

  it('imports Throttle from @nestjs/throttler', () => {
    expect(source).toMatch(
      /import\s*\{\s*[^}]*\bThrottle\b[^}]*\}\s*from\s*['"]@nestjs\/throttler['"]/,
    );
  });
});
