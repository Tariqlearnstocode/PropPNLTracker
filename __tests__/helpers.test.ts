import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getURL,
  toDateTime,
  calculateTrialEndUnixTimestamp,
  getStatusRedirect,
  getErrorRedirect,
} from '@/utils/helpers';

describe('getURL', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('defaults to localhost when no env vars are set', () => {
    expect(getURL()).toBe('http://localhost:3000');
  });

  it('uses NEXT_PUBLIC_SITE_URL when set', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://myapp.com';
    expect(getURL()).toBe('https://myapp.com');
  });

  it('defaults to localhost when SITE_URL is not set', () => {
    expect(getURL()).toBe('http://localhost:3000');
  });

  it('strips trailing slashes', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://myapp.com///';
    expect(getURL()).toBe('https://myapp.com');
  });

  it('adds https:// when protocol is missing', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'myapp.com';
    expect(getURL()).toBe('https://myapp.com');
  });

  it('appends path without double slashes', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://myapp.com/';
    expect(getURL('/dashboard')).toBe('https://myapp.com/dashboard');
  });

  it('handles path without leading slash', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://myapp.com';
    expect(getURL('dashboard')).toBe('https://myapp.com/dashboard');
  });

  it('returns base URL when path is empty string', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://myapp.com';
    expect(getURL('')).toBe('https://myapp.com');
  });

  it('ignores blank SITE_URL and falls through to localhost', () => {
    process.env.NEXT_PUBLIC_SITE_URL = '   ';
    expect(getURL()).toBe('http://localhost:3000');
  });
});

describe('toDateTime', () => {
  it('converts seconds to Date object', () => {
    const result = toDateTime(0);
    expect(result.toISOString()).toBe('1970-01-01T00:00:00.000Z');
  });

  it('converts 86400 seconds to Jan 2, 1970', () => {
    const result = toDateTime(86400);
    expect(result.getUTCDate()).toBe(2);
    expect(result.getUTCMonth()).toBe(0);
    expect(result.getUTCFullYear()).toBe(1970);
  });
});

describe('calculateTrialEndUnixTimestamp', () => {
  it('returns undefined for null', () => {
    expect(calculateTrialEndUnixTimestamp(null)).toBeUndefined();
  });

  it('returns undefined for undefined', () => {
    expect(calculateTrialEndUnixTimestamp(undefined)).toBeUndefined();
  });

  it('returns undefined for less than 2 days', () => {
    expect(calculateTrialEndUnixTimestamp(1)).toBeUndefined();
    expect(calculateTrialEndUnixTimestamp(0)).toBeUndefined();
    expect(calculateTrialEndUnixTimestamp(-1)).toBeUndefined();
  });

  it('returns a Unix timestamp for valid trial period', () => {
    const result = calculateTrialEndUnixTimestamp(7);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('adds trialPeriodDays + 1 days to current time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));

    const result = calculateTrialEndUnixTimestamp(7);
    // 7 + 1 = 8 days from epoch start of 2025-01-01
    const expected = new Date('2025-01-09T00:00:00Z').getTime() / 1000;
    expect(result).toBe(Math.floor(expected));

    vi.useRealTimers();
  });
});

describe('getStatusRedirect', () => {
  it('builds redirect path with status params', () => {
    const result = getStatusRedirect('/dashboard', 'Success', 'You did it');
    expect(result).toBe(
      '/dashboard?status=Success&status_description=You%20did%20it',
    );
  });

  it('omits description when empty', () => {
    const result = getStatusRedirect('/dashboard', 'Done');
    expect(result).toBe('/dashboard?status=Done');
  });

  it('includes disable_button param', () => {
    const result = getStatusRedirect('/page', 'OK', '', true);
    expect(result).toContain('disable_button=true');
  });

  it('appends arbitrary params', () => {
    const result = getStatusRedirect('/page', 'OK', '', false, 'foo=bar');
    expect(result).toContain('foo=bar');
  });
});

describe('getErrorRedirect', () => {
  it('builds redirect path with error params', () => {
    const result = getErrorRedirect('/login', 'Auth failed', 'Bad password');
    expect(result).toBe(
      '/login?error=Auth%20failed&error_description=Bad%20password',
    );
  });

  it('omits description when empty', () => {
    const result = getErrorRedirect('/login', 'Oops');
    expect(result).toBe('/login?error=Oops');
  });
});
