import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { env } from '$env/dynamic/private';
import type { Database } from '$lib/types/database';

/**
 * Service role Supabase client for admin operations.
 * Bypasses RLS - use only in admin-protected server routes.
 */
export function createAdminClient() {
	return createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Check if an email is in the admin allow-list.
 */
export function isAdminEmail(email: string): boolean {
	const adminEmails = (env.ADMIN_EMAILS ?? '')
		.split(',')
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean);
	return adminEmails.includes(email.toLowerCase());
}
