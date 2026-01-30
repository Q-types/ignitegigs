import { describe, it, expect, vi } from 'vitest';

// Mock the 'crypto' module's randomBytes for secureRandomCheck tests
vi.mock('crypto', () => ({
	randomBytes: vi.fn()
}));

import {
	isValidRedirectUrl,
	getSafeRedirectUrl,
	sanitizeForLog,
	secureRandomCheck,
	safeParseInt
} from '../../src/lib/server/security';

import { randomBytes } from 'crypto';

describe('sanitizeForLog', () => {
	it('strips newlines from strings', () => {
		const result = sanitizeForLog('line one\nline two\rline three');
		expect(result).toBe('line one line two line three');
		expect(result).not.toContain('\n');
		expect(result).not.toContain('\r');
	});

	it('strips control characters', () => {
		const result = sanitizeForLog('hello\x00world\x1F');
		expect(result).toBe('helloworld');
	});

	it('truncates strings longer than 500 characters', () => {
		const longString = 'a'.repeat(1000);
		const result = sanitizeForLog(longString);
		expect(result.length).toBe(500);
	});

	it('returns [null] for null input', () => {
		expect(sanitizeForLog(null)).toBe('[null]');
	});

	it('returns [null] for undefined input', () => {
		expect(sanitizeForLog(undefined)).toBe('[null]');
	});

	it('serializes non-string values as JSON', () => {
		expect(sanitizeForLog({ key: 'value' })).toBe('{"key":"value"}');
		expect(sanitizeForLog(42)).toBe('42');
		expect(sanitizeForLog(true)).toBe('true');
		expect(sanitizeForLog([1, 2, 3])).toBe('[1,2,3]');
	});

	it('returns [unserializable] for circular objects', () => {
		const circular: Record<string, unknown> = {};
		circular.self = circular;
		expect(sanitizeForLog(circular)).toBe('[unserializable]');
	});

	it('handles strings that look like HTML/script tags', () => {
		const input = '<script>alert("xss")</script>';
		const result = sanitizeForLog(input);
		// sanitizeForLog does not strip HTML tags but it does strip control
		// characters and newlines; the tag itself passes through as-is since
		// it's safe in a log context (no browser rendering).
		expect(result).toBe('<script>alert("xss")</script>');
	});

	it('handles strings with log injection patterns', () => {
		const input = 'user\n[ERROR] Fake log entry\nreal data';
		const result = sanitizeForLog(input);
		// Newlines replaced with spaces, preventing injection of fake log lines
		expect(result).not.toContain('\n');
		expect(result).toBe('user [ERROR] Fake log entry real data');
	});

	it('passes through clean strings unchanged', () => {
		expect(sanitizeForLog('hello world')).toBe('hello world');
	});
});

describe('isValidRedirectUrl', () => {
	it('accepts valid relative paths', () => {
		expect(isValidRedirectUrl('/dashboard')).toBe(true);
		expect(isValidRedirectUrl('/auth/login')).toBe(true);
		expect(isValidRedirectUrl('/performers/123')).toBe(true);
		expect(isValidRedirectUrl('/')).toBe(true);
	});

	it('rejects null', () => {
		expect(isValidRedirectUrl(null)).toBe(false);
	});

	it('rejects empty string', () => {
		expect(isValidRedirectUrl('')).toBe(false);
	});

	it('rejects absolute URLs', () => {
		expect(isValidRedirectUrl('https://evil.com')).toBe(false);
		expect(isValidRedirectUrl('http://evil.com')).toBe(false);
	});

	it('rejects protocol-relative URLs', () => {
		expect(isValidRedirectUrl('//evil.com')).toBe(false);
	});

	it('rejects javascript: URLs', () => {
		expect(isValidRedirectUrl('javascript:alert(1)')).toBe(false);
		expect(isValidRedirectUrl('/path?javascript:alert(1)')).toBe(false);
	});

	it('rejects javascript: URLs case-insensitively', () => {
		expect(isValidRedirectUrl('JAVASCRIPT:alert(1)')).toBe(false);
		expect(isValidRedirectUrl('JavaScript:alert(1)')).toBe(false);
	});

	it('rejects data: URLs', () => {
		expect(isValidRedirectUrl('data:text/html,<h1>hi</h1>')).toBe(false);
	});

	it('rejects data: URLs case-insensitively', () => {
		expect(isValidRedirectUrl('DATA:text/html,<h1>hi</h1>')).toBe(false);
	});

	it('rejects backslash tricks', () => {
		expect(isValidRedirectUrl('/path\\something')).toBe(false);
	});

	it('rejects paths not starting with /', () => {
		expect(isValidRedirectUrl('dashboard')).toBe(false);
		expect(isValidRedirectUrl('../')).toBe(false);
	});
});

describe('getSafeRedirectUrl', () => {
	it('returns the URL when it is valid', () => {
		expect(getSafeRedirectUrl('/dashboard')).toBe('/dashboard');
		expect(getSafeRedirectUrl('/performers/123')).toBe('/performers/123');
	});

	it('returns default URL when input is null', () => {
		expect(getSafeRedirectUrl(null)).toBe('/dashboard');
	});

	it('returns default URL when input is invalid', () => {
		expect(getSafeRedirectUrl('https://evil.com')).toBe('/dashboard');
		expect(getSafeRedirectUrl('//evil.com')).toBe('/dashboard');
	});

	it('returns custom default URL when provided', () => {
		expect(getSafeRedirectUrl(null, '/home')).toBe('/home');
		expect(getSafeRedirectUrl('https://evil.com', '/home')).toBe('/home');
	});
});

describe('secureRandomCheck', () => {
	it('returns true when random value is below probability', () => {
		// Mock randomBytes to return a value that produces 0.0 (all zeros)
		const mockBuffer = Buffer.alloc(4, 0);
		vi.mocked(randomBytes).mockReturnValue(mockBuffer as any);

		expect(secureRandomCheck(0.5)).toBe(true);
	});

	it('returns false when random value is above probability', () => {
		// Mock randomBytes to return max value (0xFFFFFFFF)
		const mockBuffer = Buffer.from([0xff, 0xff, 0xff, 0xff]);
		vi.mocked(randomBytes).mockReturnValue(mockBuffer as any);

		// 0xFFFFFFFF / 0xFFFFFFFF = 1.0, which is NOT < 0.5
		expect(secureRandomCheck(0.5)).toBe(false);
	});

	it('returns true with probability 1.0 for any value less than max', () => {
		const mockBuffer = Buffer.from([0x7f, 0xff, 0xff, 0xff]);
		vi.mocked(randomBytes).mockReturnValue(mockBuffer as any);

		expect(secureRandomCheck(1.0)).toBe(true);
	});

	it('returns false with probability 0 for any value', () => {
		const mockBuffer = Buffer.alloc(4, 0);
		vi.mocked(randomBytes).mockReturnValue(mockBuffer as any);

		// 0 / 0xFFFFFFFF = ~0, which is NOT < 0
		expect(secureRandomCheck(0)).toBe(false);
	});
});

describe('safeParseInt', () => {
	it('parses valid integer strings', () => {
		expect(safeParseInt('42', 0)).toBe(42);
		expect(safeParseInt('0', 10)).toBe(0);
		expect(safeParseInt('-5', 0)).toBe(-5);
	});

	it('returns default value for null input', () => {
		expect(safeParseInt(null, 10)).toBe(10);
	});

	it('returns default value for empty string', () => {
		expect(safeParseInt('', 10)).toBe(10);
	});

	it('returns default value for non-numeric strings', () => {
		expect(safeParseInt('abc', 10)).toBe(10);
		expect(safeParseInt('not-a-number', 0)).toBe(0);
	});

	it('parses with custom radix', () => {
		expect(safeParseInt('ff', 0, 16)).toBe(255);
		expect(safeParseInt('10', 0, 2)).toBe(2);
	});

	it('handles strings with leading numbers', () => {
		// parseInt stops at the first non-numeric character
		expect(safeParseInt('42px', 0)).toBe(42);
	});
});
