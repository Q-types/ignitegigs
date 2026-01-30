/**
 * In-memory rate limiter for serverless functions
 *
 * Each Vercel function instance has its own memory, so this won't share state
 * across instances. That's acceptable for moderate traffic — it still prevents
 * rapid-fire abuse from a single instance and complements Supabase Auth's own
 * server-side rate limits.
 *
 * Named configurations let each endpoint declare its own budget.
 */

import { fail } from '@sveltejs/kit';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RateLimitConfig {
	windowMs: number; // Time window in milliseconds
	maxRequests: number; // Maximum requests per window
}

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

interface BruteForceLockoutEntry {
	failures: number;
	lockedUntil: number | null; // Epoch ms when lockout expires, or null
}

interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	resetIn: number; // ms until the current window resets
}

// ---------------------------------------------------------------------------
// Preset configurations
// ---------------------------------------------------------------------------

export const RATE_LIMITS = {
	default: { windowMs: 60_000, maxRequests: 60 },
	login: { windowMs: 60_000, maxRequests: 5 },
	signup: { windowMs: 300_000, maxRequests: 3 },
	api: { windowMs: 60_000, maxRequests: 30 },
	booking: { windowMs: 60_000, maxRequests: 10 },
	contact: { windowMs: 300_000, maxRequests: 3 },
} as const;

export type RateLimitPreset = keyof typeof RATE_LIMITS;

// ---------------------------------------------------------------------------
// Stores (module-level — survives for the lifetime of the function instance)
// ---------------------------------------------------------------------------

const store = new Map<string, RateLimitEntry>();
const bruteForceStore = new Map<string, BruteForceLockoutEntry>();
let cleanupCounter = 0;

// Brute-force lockout settings
const BRUTE_FORCE_MAX_FAILURES = 10; // lock after 10 consecutive failures
const BRUTE_FORCE_LOCKOUT_MS = 15 * 60 * 1000; // 15-minute lockout

// ---------------------------------------------------------------------------
// Periodic cleanup
// ---------------------------------------------------------------------------

function maybeCleanup(): void {
	cleanupCounter++;
	if (cleanupCounter < 100) return;

	cleanupCounter = 0;
	const now = Date.now();

	for (const [key, entry] of store.entries()) {
		if (entry.resetTime < now) {
			store.delete(key);
		}
	}

	for (const [key, entry] of bruteForceStore.entries()) {
		// Remove entries whose lockout has expired and have no recent failures
		if (entry.lockedUntil !== null && entry.lockedUntil < now) {
			bruteForceStore.delete(key);
		}
	}
}

// ---------------------------------------------------------------------------
// Core rate-limit check
// ---------------------------------------------------------------------------

/**
 * Check whether a request identified by `identifier` is within the allowed
 * rate. Pass a preset name **or** a custom config object.
 */
export function rateLimit(
	identifier: string,
	config: Partial<RateLimitConfig> | RateLimitPreset = 'default'
): RateLimitResult {
	const resolved: RateLimitConfig =
		typeof config === 'string'
			? RATE_LIMITS[config]
			: { ...RATE_LIMITS.default, ...config };

	const { windowMs, maxRequests } = resolved;
	const now = Date.now();

	maybeCleanup();

	const entry = store.get(identifier);

	if (!entry || entry.resetTime < now) {
		// New window
		store.set(identifier, { count: 1, resetTime: now + windowMs });
		return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
	}

	if (entry.count >= maxRequests) {
		return { allowed: false, remaining: 0, resetIn: entry.resetTime - now };
	}

	entry.count++;
	return {
		allowed: true,
		remaining: maxRequests - entry.count,
		resetIn: entry.resetTime - now
	};
}

// ---------------------------------------------------------------------------
// Brute-force lockout helpers
// ---------------------------------------------------------------------------

/**
 * Check if an identifier is currently locked out due to brute-force attempts.
 * Returns the number of milliseconds remaining on the lockout, or 0 if not
 * locked.
 */
export function isLockedOut(identifier: string): number {
	const entry = bruteForceStore.get(identifier);
	if (!entry || entry.lockedUntil === null) return 0;

	const remaining = entry.lockedUntil - Date.now();
	if (remaining <= 0) {
		// Lockout expired — reset
		bruteForceStore.delete(identifier);
		return 0;
	}
	return remaining;
}

/**
 * Record a failed authentication attempt. After `BRUTE_FORCE_MAX_FAILURES`
 * consecutive failures the identifier is locked out for
 * `BRUTE_FORCE_LOCKOUT_MS`.
 */
export function recordFailedAttempt(identifier: string): void {
	const entry = bruteForceStore.get(identifier) ?? {
		failures: 0,
		lockedUntil: null
	};

	entry.failures++;
	if (entry.failures >= BRUTE_FORCE_MAX_FAILURES) {
		entry.lockedUntil = Date.now() + BRUTE_FORCE_LOCKOUT_MS;
	}

	bruteForceStore.set(identifier, entry);
}

/**
 * Clear the failure counter for an identifier (call on successful login).
 */
export function clearFailedAttempts(identifier: string): void {
	bruteForceStore.delete(identifier);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Derive a rate-limit key from the incoming request.
 *
 * Uses `x-forwarded-for` (set by Vercel / Cloudflare) and falls back to
 * `'unknown'`.
 */
export function getRateLimitKey(request: Request, prefix = 'api'): string {
	const forwarded = request.headers.get('x-forwarded-for');
	const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
	return `${prefix}:${ip}`;
}

/**
 * Convenience: build a 429 JSON response for API routes.
 */
export function rateLimitedResponse(resetIn: number): Response {
	return new Response(
		JSON.stringify({
			error: 'Too many requests',
			retryAfter: Math.ceil(resetIn / 1000)
		}),
		{
			status: 429,
			headers: {
				'Content-Type': 'application/json',
				'Retry-After': Math.ceil(resetIn / 1000).toString()
			}
		}
	);
}

/**
 * Convenience for SvelteKit form actions: check rate limit and return a
 * `fail()` result if the limit is exceeded. Returns `null` when the request
 * is allowed.
 *
 * Usage inside an action:
 * ```ts
 * const blocked = checkFormRateLimit(request, 'login');
 * if (blocked) return blocked;
 * ```
 */
export function checkFormRateLimit(
	request: Request,
	preset: RateLimitPreset = 'default'
) {
	const key = getRateLimitKey(request, preset);

	// Check brute-force lockout first
	const lockoutRemaining = isLockedOut(key);
	if (lockoutRemaining > 0) {
		const minutes = Math.ceil(lockoutRemaining / 60_000);
		return fail(429, {
			error: `Too many failed attempts. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`
		});
	}

	const result = rateLimit(key, preset);
	if (!result.allowed) {
		const seconds = Math.ceil(result.resetIn / 1000);
		return fail(429, {
			error: `Too many requests. Please try again in ${seconds} second${seconds === 1 ? '' : 's'}.`
		});
	}

	return null;
}
