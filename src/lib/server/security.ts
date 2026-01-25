import { randomBytes } from 'crypto';

/**
 * Validate redirect URL to prevent open redirect attacks
 * Only allows relative paths starting with /
 */
export function isValidRedirectUrl(url: string | null): boolean {
	if (!url) return false;

	// Must start with single forward slash (relative path)
	if (!url.startsWith('/')) return false;

	// Block protocol-relative URLs (//evil.com)
	if (url.startsWith('//')) return false;

	// Block javascript: URLs
	if (url.toLowerCase().includes('javascript:')) return false;

	// Block data: URLs
	if (url.toLowerCase().includes('data:')) return false;

	// Block backslash tricks
	if (url.includes('\\')) return false;

	return true;
}

/**
 * Get safe redirect URL or default
 */
export function getSafeRedirectUrl(url: string | null, defaultUrl = '/dashboard'): string {
	if (isValidRedirectUrl(url)) {
		return url!;
	}
	return defaultUrl;
}

/**
 * Sanitize string for logging (prevent log injection)
 */
export function sanitizeForLog(input: unknown): string {
	if (input === null || input === undefined) return '[null]';
	if (typeof input !== 'string') {
		try {
			return JSON.stringify(input).slice(0, 500);
		} catch {
			return '[unserializable]';
		}
	}
	return input
		.replace(/[\n\r]/g, ' ') // Remove newlines (prevent injection)
		.replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
		.slice(0, 500); // Limit length
}

/**
 * Cryptographically secure random check (replacement for Math.random())
 */
export function secureRandomCheck(probability: number): boolean {
	const bytes = randomBytes(4);
	const value = bytes.readUInt32BE(0) / 0xffffffff;
	return value < probability;
}

/**
 * Safe parseInt with radix
 */
export function safeParseInt(value: string | null, defaultValue: number, radix = 10): number {
	if (!value) return defaultValue;
	const parsed = parseInt(value, radix);
	return isNaN(parsed) ? defaultValue : parsed;
}
