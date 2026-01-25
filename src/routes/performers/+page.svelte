<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { PerformerCard, PerformerGrid } from '$lib/components/performer';

	let { data } = $props();

	let searchQuery = $state(data.filters.search);
	let category = $state(data.filters.category || 'all');
	let location = $state(data.filters.location);
	let sortBy = $state(data.filters.sortBy);
	let showFilters = $state(false);

	const categories = [
		{ value: 'all', label: 'All Performers' },
		{ value: 'fire', label: 'Fire Performers' },
		{ value: 'led', label: 'LED Performers' },
		{ value: 'circus', label: 'Circus Arts' },
		{ value: 'dance', label: 'Dance' }
	];

	const sortOptions = [
		{ value: 'rating', label: 'Top Rated' },
		{ value: 'bookings', label: 'Most Booked' },
		{ value: 'price-low', label: 'Price: Low to High' },
		{ value: 'price-high', label: 'Price: High to Low' },
		{ value: 'newest', label: 'Newest' }
	];

	function applyFilters() {
		const params = new URLSearchParams();
		if (searchQuery) params.set('q', searchQuery);
		if (category && category !== 'all') params.set('category', category);
		if (location) params.set('location', location);
		if (sortBy && sortBy !== 'rating') params.set('sort', sortBy);

		goto(`/performers?${params.toString()}`, { replaceState: true });
	}

	function handleSearch(e: Event) {
		e.preventDefault();
		applyFilters();
	}

	function clearFilters() {
		searchQuery = '';
		category = 'all';
		location = '';
		sortBy = 'rating';
		goto('/performers', { replaceState: true });
	}

	function goToPage(pageNum: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', pageNum.toString());
		goto(`/performers?${params.toString()}`);
	}
</script>

<svelte:head>
	<title>Find Fire & LED Performers - IgniteGigs</title>
	<meta
		name="description"
		content="Browse and book amazing fire performers, LED entertainers, and circus artists for your event. Direct booking, no agency fees."
	/>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Hero Section -->
	<div class="bg-gradient-to-br from-secondary via-secondary to-secondary/90 text-white">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
			<h1 class="font-display text-3xl lg:text-4xl font-bold mb-4">
				Find Your Perfect Performer
			</h1>
			<p class="text-lg text-white/80 mb-8 max-w-2xl">
				Browse our curated selection of fire artists, LED performers, and circus entertainers. Book directly and save up to 40% on agency fees.
			</p>

			<!-- Search Bar -->
			<form onsubmit={handleSearch} class="flex flex-col sm:flex-row gap-3 max-w-3xl">
				<div class="flex-1 relative">
					<svg
						class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						type="text"
						placeholder="Search performers, act types..."
						bind:value={searchQuery}
						class="w-full h-12 pl-12 pr-4 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary"
					/>
				</div>
				<div class="relative">
					<svg
						class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
					</svg>
					<input
						type="text"
						placeholder="Location"
						bind:value={location}
						class="w-full sm:w-48 h-12 pl-12 pr-4 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary"
					/>
				</div>
				<button type="submit" class="btn-primary h-12 px-8">
					Search
				</button>
			</form>
		</div>
	</div>

	<!-- Filters Bar -->
	<div class="bg-white border-b border-gray-200 sticky top-0 z-30">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between py-4 gap-4">
				<!-- Category Pills (Desktop) -->
				<div class="hidden md:flex items-center gap-2 flex-wrap">
					{#each categories as cat}
						<button
							class="px-4 py-2 rounded-full text-sm font-medium transition-all {category === cat.value
								? 'bg-primary text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
							onclick={() => {
								category = cat.value;
								applyFilters();
							}}
						>
							{cat.label}
						</button>
					{/each}
				</div>

				<!-- Mobile Filter Button -->
				<button
					class="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium"
					onclick={() => (showFilters = !showFilters)}
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
						/>
					</svg>
					Filters
				</button>

				<!-- Sort & Results Count -->
				<div class="flex items-center gap-4">
					<span class="text-sm text-gray-500 hidden sm:inline">
						{data.totalCount} performer{data.totalCount !== 1 ? 's' : ''} found
					</span>
					<select
						bind:value={sortBy}
						onchange={applyFilters}
						class="input py-2 pr-8 text-sm min-w-[160px]"
					>
						{#each sortOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Mobile Filters Panel -->
			{#if showFilters}
				<div class="md:hidden pb-4 border-t border-gray-100 pt-4">
					<div class="space-y-4">
						<div>
							<label class="label">Category</label>
							<select bind:value={category} class="input">
								{#each categories as cat}
									<option value={cat.value}>{cat.label}</option>
								{/each}
							</select>
						</div>
						<div class="flex gap-2">
							<button class="btn-primary flex-1" onclick={applyFilters}>
								Apply Filters
							</button>
							<button class="btn-outline flex-1" onclick={clearFilters}>
								Clear
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Results Grid -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if data.performers.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each data.performers as performer}
					<PerformerCard {performer} />
				{/each}
			</div>

			<!-- Pagination -->
			{#if data.totalPages > 1}
				<div class="mt-12 flex items-center justify-center gap-2">
					<button
						class="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={data.page <= 1}
						onclick={() => goToPage(data.page - 1)}
					>
						Previous
					</button>

					<div class="flex items-center gap-1">
						{#each Array(Math.min(5, data.totalPages)) as _, i}
							{@const pageNum = data.page <= 3 ? i + 1 : data.page - 2 + i}
							{#if pageNum > 0 && pageNum <= data.totalPages}
								<button
									class="w-10 h-10 rounded-lg font-medium transition-colors {pageNum === data.page
										? 'bg-primary text-white'
										: 'text-gray-600 hover:bg-gray-100'}"
									onclick={() => goToPage(pageNum)}
								>
									{pageNum}
								</button>
							{/if}
						{/each}
					</div>

					<button
						class="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={data.page >= data.totalPages}
						onclick={() => goToPage(data.page + 1)}
					>
						Next
					</button>
				</div>
			{/if}
		{:else}
			<!-- Empty State -->
			<div class="text-center py-16">
				<div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
				<h3 class="font-display text-xl font-semibold text-gray-900 mb-2">
					No performers found
				</h3>
				<p class="text-gray-600 mb-6 max-w-md mx-auto">
					We couldn't find any performers matching your criteria. Try adjusting your filters or search terms.
				</p>
				<button class="btn-primary" onclick={clearFilters}>
					Clear all filters
				</button>
			</div>
		{/if}
	</div>
</div>
