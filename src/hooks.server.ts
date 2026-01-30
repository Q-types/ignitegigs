import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/types/database';

const securityHandle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Security headers for HTML responses
	if (response.headers.get('content-type')?.includes('text/html')) {
		response.headers.set('X-Content-Type-Options', 'nosniff');
		response.headers.set('X-Frame-Options', 'DENY');
		response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
		response.headers.set(
			'Permissions-Policy',
			'camera=(), microphone=(), geolocation=()'
		);
	}

	return response;
};

const supabaseHandle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	);

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error) {
			// JWT validation failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	// Get initial session data
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuardHandle: Handle = async ({ event, resolve }) => {
	// Protected routes that require authentication
	const protectedRoutes = ['/dashboard', '/admin', '/bookings', '/messages', '/settings', '/profile/edit'];

	const isProtectedRoute = protectedRoutes.some((route) => event.url.pathname.startsWith(route));

	if (isProtectedRoute && !event.locals.session) {
		const redirectTo = event.url.pathname + event.url.search;
		throw redirect(303, `/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`);
	}

	// Redirect logged-in users away from auth pages
	const authRoutes = ['/auth/login', '/auth/signup'];
	const isAuthRoute = authRoutes.some((route) => event.url.pathname.startsWith(route));

	if (isAuthRoute && event.locals.session) {
		throw redirect(303, '/dashboard');
	}

	return resolve(event);
};

export const handle = sequence(securityHandle, supabaseHandle, authGuardHandle);
