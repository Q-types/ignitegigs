import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Session is already populated by hooks.server.ts
	return {
		session: locals.session,
		user: locals.user
	};
};
