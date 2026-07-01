import * as fs from 'fs';
import * as path from 'path';

describe('AuthController throttle configuration', () => {
  const source = fs.readFileSync(
    path.join(__dirname, 'auth.controller.ts'),
    'utf8',
  );

  const extractMethodBlock = (methodName: string): string => {
    const idx = source.indexOf(`async ${methodName}(`);
    if (idx < 0) return '';
    // Take everything from the method declaration back to the nearest preceding @ decorator
    const slice = source.slice(Math.max(0, idx - 400), idx);
    return slice;
  };

  it('login is throttled at 30/minute', () => {
    const block = extractMethodBlock('login');
    expect(block).toMatch(/@Throttle\s*\(\s*\{\s*default:\s*\{\s*limit:\s*30,\s*ttl:\s*60000\s*\}\s*\}\s*\)/);
  });

  it('register is throttled at 5/minute', () => {
    const block = extractMethodBlock('register');
    expect(block).toMatch(/@Throttle\s*\(\s*\{\s*default:\s*\{\s*limit:\s*5,\s*ttl:\s*60000\s*\}\s*\}\s*\)/);
  });

  it('refresh is throttled at 15/minute', () => {
    const block = extractMethodBlock('refresh');
    expect(block).toMatch(/@Throttle\s*\(\s*\{\s*default:\s*\{\s*limit:\s*15,\s*ttl:\s*60000\s*\}\s*\}\s*\)/);
  });

  it('reset-password is throttled strictly at 3/minute', () => {
    const block = extractMethodBlock('resetPassword');
    expect(block).toMatch(/@Throttle\s*\(\s*\{\s*default:\s*\{\s*limit:\s*3,\s*ttl:\s*60000\s*\}\s*\}\s*\)/);
  });

  it('sendOtp uses @SkipThrottle', () => {
    const block = extractMethodBlock('sendOtp');
    expect(block).toMatch(/@SkipThrottle\s*\(\s*\)/);
  });

  it('verifyOtp uses @SkipThrottle', () => {
    const block = extractMethodBlock('verifyOtp');
    expect(block).toMatch(/@SkipThrottle\s*\(\s*\)/);
  });

  it('imports both Throttle and SkipThrottle from @nestjs/throttler', () => {
    expect(source).toMatch(
      /import\s*\{\s*Throttle\s*,\s*SkipThrottle\s*\}\s*from\s*['"]@nestjs\/throttler['"]/,
    );
  });
});
