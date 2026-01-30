import { describe, it, expect, beforeEach, vi } from 'vitest';

// The module uses in-memory Maps at module scope. We need to re-import
// with a fresh module for each test group so state doesn't leak.
// Vitest's dynamic import + resetModules handles this.

// We must mock @sveltejs/kit since rateLimit.ts imports `fail` from it
vi.mock('@sveltejs/kit', () => ({
	fail: (status: number, data: Record<string, unknown>) => ({ status, data })
}));

import {
	rateLimit,
	RATE_LIMITS,
	recordFailedAttempt,
	isLockedOut,
	clearFailedAttempts,
	getRateLimitKey,
	rateLimitedResponse,
	checkFormRateLimit,
	type RateLimitPreset
} from '../../src/lib/server/rateLimit';

describe('rateLimit', () => {
	describe('rateLimit() core function', () => {
		it('allows the first request', () => {
			const result = rateLimit('test-allow-first', { windowMs: 60000, maxRequests: 5 });
			expect(result.allowed).toBe(true);
			expect(result.remaining).toBe(4);
			expect(result.resetIn).toBeGreaterThan(0);
		});

		it('allows requests under the limit', () => {
			const id = 'test-under-limit';
			const config = { windowMs: 60000, maxRequests: 5 };

			for (let i = 0; i < 4; i++) {
				const result = rateLimit(id, config);
				expect(result.allowed).toBe(true);
			}

			const final = rateLimit(id, config);
			expect(final.allowed).toBe(true);
			expect(final.remaining).toBe(0);
		});

		it('blocks requests over the limit', () => {
			const id = 'test-over-limit';
			const config = { windowMs: 60000, maxRequests: 3 };

			// Exhaust the limit
			for (let i = 0; i < 3; i++) {
				rateLimit(id, config);
			}

			const blocked = rateLimit(id, config);
			expect(blocked.allowed).toBe(false);
			expect(blocked.remaining).toBe(0);
			expect(blocked.resetIn).toBeGreaterThan(0);
		});

		it('returns correct remaining count as requests accumulate', () => {
			const id = 'test-remaining-count';
			const config = { windowMs: 60000, maxRequests: 5 };

			const r1 = rateLimit(id, config);
			expect(r1.remaining).toBe(4);

			const r2 = rateLimit(id, config);
			expect(r2.remaining).toBe(3);

			const r3 = rateLimit(id, config);
			expect(r3.remaining).toBe(2);
		});

		it('resets after the time window expires', () => {
			const id = 'test-window-reset';
			const config = { windowMs: 100, maxRequests: 1 };

			const r1 = rateLimit(id, config);
			expect(r1.allowed).toBe(true);

			const r2 = rateLimit(id, config);
			expect(r2.allowed).toBe(false);

			// Advance time past the window
			vi.useFakeTimers();
			vi.advanceTimersByTime(150);

			const r3 = rateLimit(id, config);
			expect(r3.allowed).toBe(true);

			vi.useRealTimers();
		});
	});

	describe('rateLimit() with named presets', () => {
		it('uses default preset when no config is provided', () => {
			const result = rateLimit('test-default-preset');
			expect(result.allowed).toBe(true);
			// Default allows 60 requests per 60s window
			expect(result.remaining).toBe(RATE_LIMITS.default.maxRequests - 1);
		});

		it('uses login preset', () => {
			const id = 'test-login-preset';

			// Login allows 5 requests per 60s
			for (let i = 0; i < 5; i++) {
				const result = rateLimit(id, 'login');
				expect(result.allowed).toBe(true);
			}

			const blocked = rateLimit(id, 'login');
			expect(blocked.allowed).toBe(false);
		});

		it('uses signup preset', () => {
			const id = 'test-signup-preset';

			// Signup allows 3 requests per 300s
			for (let i = 0; i < 3; i++) {
				const result = rateLimit(id, 'signup');
				expect(result.allowed).toBe(true);
			}

			const blocked = rateLimit(id, 'signup');
			expect(blocked.allowed).toBe(false);
		});

		it('uses api preset', () => {
			const id = 'test-api-preset';
			const result = rateLimit(id, 'api');
			expect(result.allowed).toBe(true);
			expect(result.remaining).toBe(RATE_LIMITS.api.maxRequests - 1);
		});

		it('uses booking preset', () => {
			const id = 'test-booking-preset';
			const result = rateLimit(id, 'booking');
			expect(result.allowed).toBe(true);
			expect(result.remaining).toBe(RATE_LIMITS.booking.maxRequests - 1);
		});

		it('uses contact preset', () => {
			const id = 'test-contact-preset';
			const result = rateLimit(id, 'contact');
			expect(result.allowed).toBe(true);
			expect(result.remaining).toBe(RATE_LIMITS.contact.maxRequests - 1);
		});

		it('merges partial config with default', () => {
			const id = 'test-partial-config';
			const result = rateLimit(id, { maxRequests: 2 });
			expect(result.allowed).toBe(true);
			expect(result.remaining).toBe(1);

			rateLimit(id, { maxRequests: 2 });

			const blocked = rateLimit(id, { maxRequests: 2 });
			expect(blocked.allowed).toBe(false);
		});
	});

	describe('brute force lockout', () => {
		it('is not locked out initially', () => {
			const lockout = isLockedOut('bf-fresh');
			expect(lockout).toBe(0);
		});

		it('records failed attempts without locking out under threshold', () => {
			const id = 'bf-under-threshold';
			for (let i = 0; i < 9; i++) {
				recordFailedAttempt(id);
			}
			expect(isLockedOut(id)).toBe(0);
		});

		it('locks out after 10 failed attempts', () => {
			const id = 'bf-lockout-10';
			for (let i = 0; i < 10; i++) {
				recordFailedAttempt(id);
			}
			const lockoutMs = isLockedOut(id);
			expect(lockoutMs).toBeGreaterThan(0);
			// Should be approximately 15 minutes (900000ms)
			expect(lockoutMs).toBeLessThanOrEqual(15 * 60 * 1000);
		});

		it('clearFailedAttempts resets the counter', () => {
			const id = 'bf-clear';

			// Record 9 failures (just under the threshold)
			for (let i = 0; i < 9; i++) {
				recordFailedAttempt(id);
			}
			expect(isLockedOut(id)).toBe(0);

			// Clear and verify reset
			clearFailedAttempts(id);

			// 1 more attempt after clear should not cause lockout
			recordFailedAttempt(id);
			expect(isLockedOut(id)).toBe(0);
		});

		it('clearFailedAttempts removes lockout', () => {
			const id = 'bf-clear-lockout';

			// Trigger lockout
			for (let i = 0; i < 10; i++) {
				recordFailedAttempt(id);
			}
			expect(isLockedOut(id)).toBeGreaterThan(0);

			// Clear and verify lockout is gone
			clearFailedAttempts(id);
			expect(isLockedOut(id)).toBe(0);
		});

		it('lockout expires after the lockout period', () => {
			vi.useFakeTimers();

			const id = 'bf-expiry';
			for (let i = 0; i < 10; i++) {
				recordFailedAttempt(id);
			}
			expect(isLockedOut(id)).toBeGreaterThan(0);

			// Advance past the 15-minute lockout
			vi.advanceTimersByTime(15 * 60 * 1000 + 1);

			expect(isLockedOut(id)).toBe(0);

			vi.useRealTimers();
		});

		it('recordFailedAttempt -> isLockedOut -> clearFailedAttempts full flow', () => {
			const id = 'bf-full-flow';

			// Start clean
			expect(isLockedOut(id)).toBe(0);

			// Accumulate failures
			for (let i = 0; i < 10; i++) {
				recordFailedAttempt(id);
			}

			// Now locked out
			expect(isLockedOut(id)).toBeGreaterThan(0);

			// Simulate successful login clears the lockout
			clearFailedAttempts(id);
			expect(isLockedOut(id)).toBe(0);

			// Can fail again without immediate lockout
			recordFailedAttempt(id);
			expect(isLockedOut(id)).toBe(0);
		});
	});

	describe('getRateLimitKey', () => {
		it('extracts IP from x-forwarded-for header', () => {
			const request = new Request('http://localhost', {
				headers: { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' }
			});
			const key = getRateLimitKey(request, 'test');
			expect(key).toBe('test:192.168.1.1');
		});

		it('falls back to unknown when no forwarded header', () => {
			const request = new Request('http://localhost');
			const key = getRateLimitKey(request);
			expect(key).toBe('api:unknown');
		});

		it('uses the provided prefix', () => {
			const request = new Request('http://localhost');
			const key = getRateLimitKey(request, 'login');
			expect(key).toBe('login:unknown');
		});
	});

	describe('rateLimitedResponse', () => {
		it('returns a 429 response with correct headers', async () => {
			const response = rateLimitedResponse(5000);
			expect(response.status).toBe(429);
			expect(response.headers.get('Content-Type')).toBe('application/json');
			expect(response.headers.get('Retry-After')).toBe('5');

			const body = await response.json();
			expect(body.error).toBe('Too many requests');
			expect(body.retryAfter).toBe(5);
		});

		it('rounds up retry-after seconds', async () => {
			const response = rateLimitedResponse(1500);
			const body = await response.json();
			expect(body.retryAfter).toBe(2);
		});
	});

	describe('checkFormRateLimit', () => {
		it('returns null when request is allowed', () => {
			const request = new Request('http://localhost', {
				headers: { 'x-forwarded-for': '10.10.10.10' }
			});
			const result = checkFormRateLimit(request, 'default');
			expect(result).toBeNull();
		});

		it('returns a fail result when rate limited', () => {
			// Use a unique IP to avoid collisions with other tests
			const ip = '10.20.30.40';

			// Exhaust the login limit (5 requests)
			for (let i = 0; i < 5; i++) {
				const req = new Request('http://localhost', {
					headers: { 'x-forwarded-for': ip }
				});
				checkFormRateLimit(req, 'login');
			}

			const req = new Request('http://localhost', {
				headers: { 'x-forwarded-for': ip }
			});
			const result = checkFormRateLimit(req, 'login');
			expect(result).not.toBeNull();
			expect(result).toHaveProperty('status', 429);
		});
	});
});
