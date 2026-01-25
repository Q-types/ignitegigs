import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const GET: RequestHandler = async () => {
	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	// Get all active performer profiles
	const { data: performers } = await supabase
		.from('performers')
		.select('id, updated_at')
		.eq('is_active', true)
		.eq('is_verified', true);

	const baseUrl = 'https://ignitegigs.com';

	const staticPages = [
		{ loc: '', priority: '1.0', changefreq: 'weekly' },
		{ loc: '/performers', priority: '0.9', changefreq: 'daily' },
		{ loc: '/auth/login', priority: '0.3', changefreq: 'monthly' },
		{ loc: '/auth/signup', priority: '0.5', changefreq: 'monthly' }
	];

	const performerPages = (performers ?? []).map((performer) => ({
		loc: `/performers/${performer.id}`,
		priority: '0.8',
		changefreq: 'weekly',
		lastmod: performer.updated_at
	}));

	const allPages = [...staticPages, ...performerPages];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
	.map(
		(page) => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>${page.lastmod ? `\n    <lastmod>${new Date(page.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
