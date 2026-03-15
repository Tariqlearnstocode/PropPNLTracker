import { describe, it, expect } from 'vitest';
import {
  sanitizeText,
  sanitizeName,
  sanitizeEmail,
  sanitizePurpose,
  sanitizeCompanyName,
  escapeHtml,
  sanitizeOptional,
} from '@/utils/sanitize';

describe('sanitizeText', () => {
  it('returns empty string for null/undefined', () => {
    expect(sanitizeText(null)).toBe('');
    expect(sanitizeText(undefined)).toBe('');
  });

  it('trims whitespace', () => {
    expect(sanitizeText('  hello  ')).toBe('hello');
  });

  it('removes script tags and their content', () => {
    expect(sanitizeText('<script>alert("xss")</script>safe')).toBe('safe');
  });

  it('removes style tags and their content', () => {
    expect(sanitizeText('<style>body{}</style>visible')).toBe('visible');
  });

  it('removes iframe tags', () => {
    expect(
      sanitizeText('<iframe src="evil.com"></iframe>clean'),
    ).toBe('clean');
  });

  it('strips remaining HTML tags', () => {
    expect(sanitizeText('<b>bold</b> <a href="x">link</a>')).toBe(
      'bold link',
    );
  });

  it('removes control characters except newlines', () => {
    expect(sanitizeText('hello\x00world\x07!')).toBe('helloworld!');
  });

  it('preserves newlines', () => {
    expect(sanitizeText('line1\nline2')).toBe('line1\nline2');
  });

  it('truncates to maxLength', () => {
    const long = 'a'.repeat(300);
    expect(sanitizeText(long, 100)).toHaveLength(100);
  });

  it('uses default maxLength of 255', () => {
    const long = 'a'.repeat(500);
    expect(sanitizeText(long)).toHaveLength(255);
  });

  it('decodes HTML entities after stripping tags', () => {
    expect(sanitizeText('&lt;b&gt;test&lt;/b&gt;')).toBe('<b>test</b>');
  });

  it('handles nested dangerous tags', () => {
    const input =
      'before<script type="text/javascript">var x = 1;</script>after';
    expect(sanitizeText(input)).toBe('beforeafter');
  });
});

describe('sanitizeName', () => {
  it('returns empty string for null/undefined', () => {
    expect(sanitizeName(null)).toBe('');
    expect(sanitizeName(undefined)).toBe('');
  });

  it('replaces newlines with spaces', () => {
    expect(sanitizeName('First\nLast')).toBe('First Last');
  });

  it('collapses multiple spaces', () => {
    expect(sanitizeName('First    Last')).toBe('First Last');
  });

  it('trims after collapsing spaces', () => {
    expect(sanitizeName('  John   Doe  ')).toBe('John Doe');
  });

  it('strips HTML from name', () => {
    expect(sanitizeName('<b>John</b>')).toBe('John');
  });

  it('handles carriage returns', () => {
    expect(sanitizeName('Hello\r\nWorld')).toBe('Hello World');
  });
});

describe('sanitizeEmail', () => {
  it('returns empty string for null/undefined', () => {
    expect(sanitizeEmail(null)).toBe('');
    expect(sanitizeEmail(undefined)).toBe('');
  });

  it('lowercases email', () => {
    expect(sanitizeEmail('User@Example.COM')).toBe('user@example.com');
  });

  it('removes whitespace', () => {
    expect(sanitizeEmail(' user @ example.com ')).toBe('user@example.com');
  });

  it('removes control characters', () => {
    expect(sanitizeEmail('user\x00@example.com')).toBe('user@example.com');
  });

  it('strips script tags from email', () => {
    expect(
      sanitizeEmail('<script>alert(1)</script>user@example.com'),
    ).toBe('user@example.com');
  });

  it('truncates to 255 characters', () => {
    const long = 'a'.repeat(300) + '@example.com';
    expect(sanitizeEmail(long).length).toBeLessThanOrEqual(255);
  });
});

describe('sanitizePurpose', () => {
  it('returns empty string for null/undefined', () => {
    expect(sanitizePurpose(null)).toBe('');
    expect(sanitizePurpose(undefined)).toBe('');
  });

  it('allows up to 1000 characters', () => {
    const medium = 'a'.repeat(500);
    expect(sanitizePurpose(medium)).toHaveLength(500);

    const long = 'a'.repeat(1200);
    expect(sanitizePurpose(long)).toHaveLength(1000);
  });

  it('strips HTML from purpose', () => {
    expect(sanitizePurpose('<p>My purpose</p>')).toBe('My purpose');
  });
});

describe('sanitizeCompanyName', () => {
  it('delegates to sanitizeName', () => {
    expect(sanitizeCompanyName('<b>Acme Corp</b>')).toBe('Acme Corp');
    expect(sanitizeCompanyName(null)).toBe('');
  });
});

describe('escapeHtml', () => {
  it('returns empty string for null/undefined', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  it('escapes ampersand', () => {
    expect(escapeHtml('a&b')).toBe('a&amp;b');
  });

  it('escapes angle brackets', () => {
    expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#039;s');
  });

  it('escapes all special chars in one string', () => {
    expect(escapeHtml('<b>"a" & \'b\'</b>')).toBe(
      '&lt;b&gt;&quot;a&quot; &amp; &#039;b&#039;&lt;/b&gt;',
    );
  });

  it('leaves plain text unchanged', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });
});

describe('sanitizeOptional', () => {
  it('returns empty string for null/undefined', () => {
    expect(sanitizeOptional(null)).toBe('');
    expect(sanitizeOptional(undefined)).toBe('');
  });

  it('sanitizes text with default maxLength', () => {
    expect(sanitizeOptional('<script>x</script>safe')).toBe('safe');
  });

  it('respects custom maxLength', () => {
    const long = 'a'.repeat(50);
    expect(sanitizeOptional(long, 20)).toHaveLength(20);
  });
});
