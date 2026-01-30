<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { data } = $props();

	const categories = [
		{ value: '', label: 'All' },
		{ value: 'tips', label: 'Tips & Advice' },
		{ value: 'safety', label: 'Safety' },
		{ value: 'business', label: 'Business' },
		{ value: 'technique', label: 'Technique' },
		{ value: 'gear', label: 'Gear & Equipment' },
		{ value: 'industry', label: 'Industry News' },
		{ value: 'events', label: 'Events' },
		{ value: 'community', label: 'Community' }
	];

	function setCategory(cat: string) {
		const params = new URLSearchParams();
		if (cat) params.set('category', cat);
		goto(`/blog?${params.toString()}`, { replaceState: true });
	}

	function goToPage(pageNum: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', pageNum.toString());
		goto(`/blog?${params.toString()}`);
	}

	function formatDate(date: string): string {
		return new Date(date).toLocaleDateString('en-GB', {
			day: 'numeric', month: 'short', year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Community Blog - IgniteGigs</title>
	<meta name="description" content="Tips, advice, and stories from the UK's fire, LED, and circus performer community." />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Hero -->
	<div class="bg-gradient-to-br from-secondary via-secondary to-secondary/90 text-white">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="font-display text-3xl lg:text-4xl font-bold mb-4">Community Blog</h1>
					<p class="text-lg text-white/80 max-w-2xl">
						Tips, best practices, safety guides, and stories from the UK's fire, LED, and circus performer community.
					</p>
				</div>
				<a href="/blog/new" class="hidden sm:inline-flex btn-primary px-6 py-3">
					Write an Article
				</a>
			</div>
		</div>
	</div>

	<!-- Category Filter -->
	<div class="bg-white border-b border-gray-200 sticky top-0 z-30">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-2 py-4 overflow-x-auto">
				{#each categories as cat}
					<button
						class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all {data.category === cat.value
							? 'bg-primary text-white'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						onclick={() => setCategory(cat.value)}
					>
						{cat.label}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Posts Grid -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if data.posts.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.posts as post}
					<a href="/blog/{post.slug}" class="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
						<!-- Cover Image -->
						<div class="aspect-video bg-gray-100 relative overflow-hidden">
							{#if post.cover_image_url}
								<img src={post.cover_image_url} alt={post.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
							{:else}
								<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
									<svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
									</svg>
								</div>
							{/if}
							{#if post.is_featured}
								<span class="absolute top-3 left-3 px-2 py-1 bg-primary text-white text-xs font-medium rounded-full">Featured</span>
							{/if}
						</div>

						<div class="p-5">
							<!-- Category -->
							<span class="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded mb-3 capitalize">
								{post.category}
							</span>

							<h3 class="font-display text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
								{post.title}
							</h3>

							{#if post.excerpt}
								<p class="text-sm text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
							{/if}

							<!-- Author & Meta -->
							<div class="flex items-center justify-between text-sm text-gray-500">
								<div class="flex items-center gap-2">
									{#if post.author?.avatar_url}
										<img src={post.author.avatar_url} alt="" class="w-6 h-6 rounded-full" />
									{:else}
										<div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
											<span class="text-xs text-primary font-medium">{post.author?.full_name?.charAt(0) || '?'}</span>
										</div>
									{/if}
									<span class="truncate max-w-[120px]">{post.author?.full_name || 'Anonymous'}</span>
								</div>
								<span>{post.published_at ? formatDate(post.published_at) : ''}</span>
							</div>
						</div>
					</a>
				{/each}
			</div>

			<!-- Pagination -->
			{#if data.totalPages > 1}
				<div class="mt-12 flex items-center justify-center gap-2">
					<button
						class="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
						disabled={data.page <= 1}
						onclick={() => goToPage(data.page - 1)}
					>Previous</button>
					<span class="text-sm text-gray-500">Page {data.page} of {data.totalPages}</span>
					<button
						class="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
						disabled={data.page >= data.totalPages}
						onclick={() => goToPage(data.page + 1)}
					>Next</button>
				</div>
			{/if}
		{:else}
			<div class="text-center py-16">
				<div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
					</svg>
				</div>
				<h3 class="font-display text-xl font-semibold text-gray-900 mb-2">No articles yet</h3>
				<p class="text-gray-600 mb-6">Be the first to share your knowledge with the community!</p>
				<a href="/blog/new" class="btn-primary px-6">Write an Article</a>
			</div>
		{/if}
	</div>

	<!-- Mobile Write CTA -->
	<div class="sm:hidden fixed bottom-20 right-4 z-40">
		<a href="/blog/new" class="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
		</a>
	</div>
</div>
