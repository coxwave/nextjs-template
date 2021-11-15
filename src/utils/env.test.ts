import { getEnv, isDev, isProd, isTest } from './env';

describe('tests for utils/env.ts', () => {
  it('Checking NODE_ENV', () => {
    expect(isTest()).toBe(true);
    expect(isDev()).toBe(false);
    expect(isProd()).toBe(false);
  });

  it('Should not throw an error in test', () => {
    const envNameWhichNeverLikelyExists = 'IT_NEVER_EXISTS';

    expect(() => getEnv(envNameWhichNeverLikelyExists)).not.toThrowError();
    expect(getEnv(envNameWhichNeverLikelyExists)).toBe('');
  });
});
