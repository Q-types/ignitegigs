/**
 * Simple in-memory rate limiter for serverless functions
 * For production at scale, use Redis or similar distributed store
 */

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
	windowMs: number; // Time window in milliseconds
	maxRequests: number; // Maximum requests per window
}

const defaultConfig: RateLimitConfig = {
	windowMs: 60 * 1000, // 1 minute
	maxRequests: 60 // 60 requests per minute
};

export function rateLimit(
	identifier: string,
	config: Partial<RateLimitConfig> = {}
): { allowed: boolean; remaining: number; resetIn: number } {
	const { windowMs, maxRequests } = { ...defaultConfig, ...config };
	const now = Date.now();

	// Clean up expired entries periodically
	if (Math.random() < 0.01) {
		for (const [key, entry] of store.entries()) {
			if (entry.resetTime < now) {
				store.delete(key);
			}
		}
	}

	const entry = store.get(identifier);

	if (!entry || entry.resetTime < now) {
		// New window
		store.set(identifier, {
			count: 1,
			resetTime: now + windowMs
		});
		return {
			allowed: true,
			remaining: maxRequests - 1,
			resetIn: windowMs
		};
	}

	if (entry.count >= maxRequests) {
		return {
			allowed: false,
			remaining: 0,
			resetIn: entry.resetTime - now
		};
	}

	entry.count++;
	return {
		allowed: true,
		remaining: maxRequests - entry.count,
		resetIn: entry.resetTime - now
	};
}

/**
 * Get rate limit key from request
 */
export function getRateLimitKey(request: Request, prefix = 'api'): string {
	const forwarded = request.headers.get('x-forwarded-for');
	const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
	return `${prefix}:${ip}`;
}

/**
 * Create rate-limited response
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
