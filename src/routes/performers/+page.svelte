<script lang="ts">
	import { page, navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import { PerformerCard, PerformerGrid, PerformerMap } from '$lib/components/performer';
	import { SkeletonCard } from '$lib/components/ui';

	let isLoadingPerformers = $derived(
		!!$navigating && $navigating.to?.url.pathname.startsWith('/performers')
	);

	let { data } = $props();

	let searchQuery = $state(data.filters.search);
	let category = $state(data.filters.category || 'all');
	let location = $state(data.filters.location);
	let sortBy = $state(data.filters.sortBy);
	let showFilters = $state(false);

	// New filter state variables
	let minPrice = $state(data.filters.minPrice);
	let maxPrice = $state(data.filters.maxPrice);
	let minRating = $state(data.filters.minRating || '');
	let availableDate = $state(data.filters.availableDate || '');
	let verified = $state(data.filters.verified || 'all');
	let showAdvanced = $state(false);

	// View mode toggle
	let viewMode = $state<'grid' | 'map'>('grid');

	// Geolocation state
	let geoLoading = $state(false);
	let geoError = $state('');
	let geoLat = $state(data.filters.lat || '');
	let geoLng = $state(data.filters.lng || '');
	let geoRadius = $state(data.filters.radius || '25');
	let isGeoActive = $derived(!!geoLat && !!geoLng);

	const radiusOptions = [
		{ value: '5', label: '5 miles' },
		{ value: '10', label: '10 miles' },
		{ value: '25', label: '25 miles' },
		{ value: '50', label: '50 miles' },
		{ value: '100', label: '100 miles' }
	];

	const categories = [
		{ value: 'all', label: 'All Performers' },
		{ value: 'fire', label: 'Fire' },
		{ value: 'led', label: 'LED' },
		{ value: 'circus', label: 'Circus' },
		{ value: 'dance', label: 'Dance' },
		{ value: 'aerial', label: 'Aerial' },
		{ value: 'stilt', label: 'Stilt Walking' },
		{ value: 'juggling', label: 'Juggling' },
		{ value: 'acrobatics', label: 'Acrobatics' },
		{ value: 'caricature', label: 'Caricature' },
		{ value: 'comedy', label: 'Comedy' },
		{ value: 'walkabout', label: 'Walkabout' },
		{ value: 'magic', label: 'Magic' }
	];

	const sortOptions = $derived([
		...(isGeoActive ? [{ value: 'distance', label: 'Nearest First' }] : []),
		{ value: 'rating', label: 'Top Rated' },
		{ value: 'bookings', label: 'Most Booked' },
		{ value: 'price-low', label: 'Price: Low to High' },
		{ value: 'price-high', label: 'Price: High to Low' },
		{ value: 'newest', label: 'Newest' }
	]);

	// Count of active advanced filters for badge display
	let activeAdvancedCount = $derived(
		(minPrice ? 1 : 0) +
		(maxPrice ? 1 : 0) +
		(minRating ? 1 : 0) +
		(availableDate ? 1 : 0) +
		(verified && verified !== 'all' ? 1 : 0)
	);

	function applyFilters() {
		const params = new URLSearchParams();
		if (searchQuery) params.set('q', searchQuery);
		if (category && category !== 'all') params.set('category', category);
		if (location && !isGeoActive) params.set('location', location);
		if (sortBy && sortBy !== 'rating') params.set('sort', sortBy);
		if (minPrice) params.set('minPrice', minPrice);
		if (maxPrice) params.set('maxPrice', maxPrice);
		if (minRating) params.set('minRating', minRating);
		if (availableDate) params.set('availableDate', availableDate);
		if (verified && verified !== 'all') params.set('verified', verified);
		// Geolocation params
		if (geoLat) params.set('lat', geoLat);
		if (geoLng) params.set('lng', geoLng);
		if (geoLat && geoLng && geoRadius !== '25') params.set('radius', geoRadius);

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
		minPrice = '';
		maxPrice = '';
		minRating = '';
		availableDate = '';
		verified = 'all';
		geoLat = '';
		geoLng = '';
		geoRadius = '25';
		geoError = '';
		goto('/performers', { replaceState: true });
	}

	function clearAdvancedFilters() {
		minPrice = '';
		maxPrice = '';
		minRating = '';
		availableDate = '';
		verified = 'all';
		applyFilters();
	}

	function findNearMe() {
		if (!navigator.geolocation) {
			geoError = 'Geolocation is not supported by your browser.';
			return;
		}

		geoLoading = true;
		geoError = '';

		navigator.geolocation.getCurrentPosition(
			(position) => {
				geoLat = position.coords.latitude.toFixed(6);
				geoLng = position.coords.longitude.toFixed(6);
				geoLoading = false;
				// Clear text location since we are using geo
				location = '';
				sortBy = 'distance';
				applyFilters();
			},
			(err) => {
				geoLoading = false;
				switch (err.code) {
					case err.PERMISSION_DENIED:
						geoError = 'Location permission denied. Please enable location access in your browser settings.';
						break;
					case err.POSITION_UNAVAILABLE:
						geoError = 'Location information is unavailable.';
						break;
					case err.TIMEOUT:
						geoError = 'Location request timed out. Please try again.';
						break;
					default:
						geoError = 'An unknown error occurred while getting your location.';
				}
			},
			{
				enableHighAccuracy: false,
				timeout: 10000,
				maximumAge: 300000 // Cache position for 5 minutes
			}
		);
	}

	function clearGeoSearch() {
		geoLat = '';
		geoLng = '';
		geoRadius = '25';
		geoError = '';
		if (sortBy === 'distance') {
			sortBy = 'rating';
		}
		applyFilters();
	}

	function updateRadius(newRadius: string) {
		geoRadius = newRadius;
		if (isGeoActive) {
			applyFilters();
		}
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
			<form onsubmit={handleSearch} class="flex flex-col sm:flex-row gap-3 max-w-4xl">
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
				{#if isGeoActive}
					<!-- Geo search active: show radius dropdown and clear button -->
					<div class="flex items-center gap-2">
						<div class="flex items-center gap-2 bg-primary/20 border border-primary/40 rounded-lg px-4 h-12">
							<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							<span class="text-sm text-white font-medium whitespace-nowrap">Near Me</span>
						</div>
						<select
							bind:value={geoRadius}
							onchange={(e) => updateRadius((e.target as HTMLSelectElement).value)}
							class="h-12 px-3 pr-8 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-primary"
						>
							{#each radiusOptions as opt}
								<option value={opt.value}>{opt.label}</option>
							{/each}
						</select>
						<button
							type="button"
							onclick={clearGeoSearch}
							class="h-12 w-12 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
							title="Clear location search"
						>
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				{:else}
					<!-- No geo search: show location text input + Near Me button -->
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
					<button
						type="button"
						onclick={findNearMe}
						disabled={geoLoading}
						class="h-12 px-4 rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if geoLoading}
							<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Locating...
						{:else}
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
							</svg>
							Near Me
						{/if}
					</button>
				{/if}
				<button type="submit" class="btn-primary h-12 px-8">
					Search
				</button>
			</form>

			<!-- Geolocation error message -->
			{#if geoError}
				<div class="mt-3 max-w-3xl flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
					<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
					</svg>
					<span>{geoError}</span>
					<button onclick={() => (geoError = '')} class="ml-auto text-red-300 hover:text-white">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			{/if}
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
					{#if activeAdvancedCount > 0}
						<span class="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
							{activeAdvancedCount}
						</span>
					{/if}
				</button>

				<!-- Sort, View Toggle & Results Count -->
				<div class="flex items-center gap-4">
					<!-- Advanced Filters Toggle (Desktop) -->
					<button
						class="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
						onclick={() => showAdvanced = !showAdvanced}
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
						</svg>
						Advanced Filters
						{#if activeAdvancedCount > 0}
							<span class="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
								{activeAdvancedCount}
							</span>
						{/if}
						<svg class="w-4 h-4 transition-transform {showAdvanced ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					<span class="text-sm text-gray-500 hidden sm:inline">
						{data.totalCount} performer{data.totalCount !== 1 ? 's' : ''} found
					</span>

					<!-- Grid / Map View Toggle -->
					<div class="flex items-center bg-gray-100 rounded-lg p-0.5">
						<button
							onclick={() => (viewMode = 'grid')}
							class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all {viewMode === 'grid'
								? 'bg-white text-secondary shadow-sm'
								: 'text-gray-500 hover:text-gray-700'}"
							title="Grid view"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
							</svg>
							<span class="hidden sm:inline">Grid</span>
						</button>
						<button
							onclick={() => (viewMode = 'map')}
							class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all {viewMode === 'map'
								? 'bg-white text-secondary shadow-sm'
								: 'text-gray-500 hover:text-gray-700'}"
							title="Map view"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
							</svg>
							<span class="hidden sm:inline">Map</span>
						</button>
					</div>

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

						<!-- Mobile: Price Range -->
						<div>
							<label class="label text-xs mb-1">Price Range (GBP)</label>
							<div class="flex items-center gap-2">
								<input type="number" placeholder="Min" bind:value={minPrice}
									class="input py-2 text-sm w-full" min="0" />
								<span class="text-gray-400">-</span>
								<input type="number" placeholder="Max" bind:value={maxPrice}
									class="input py-2 text-sm w-full" min="0" />
							</div>
						</div>

						<!-- Mobile: Min Rating -->
						<div>
							<label class="label text-xs mb-1">Minimum Rating</label>
							<div class="flex items-center gap-1">
								{#each [1, 2, 3, 4, 5] as star}
									<button
										class="p-1"
										onclick={() => { minRating = minRating === star.toString() ? '' : star.toString(); }}
									>
										<svg class="w-6 h-6 {parseInt(minRating || '0') >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}"
											viewBox="0 0 20 20" fill="currentColor">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
										</svg>
									</button>
								{/each}
								{#if minRating}
									<span class="text-sm text-gray-500 ml-2">{minRating}+ stars</span>
								{/if}
							</div>
						</div>

						<!-- Mobile: Available Date -->
						<div>
							<label class="label text-xs mb-1">Available On</label>
							<input type="date" bind:value={availableDate}
								class="input py-2 text-sm w-full"
								min={new Date().toISOString().split('T')[0]} />
						</div>

						<!-- Mobile: Verification Filter -->
						<div>
							<label class="label text-xs mb-1">Verification</label>
							<select bind:value={verified} class="input py-2 text-sm w-full">
								<option value="all">All Verified</option>
								<option value="insured">Insured</option>
								<option value="verified_pro">Verified Pro (Equity)</option>
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

			<!-- Advanced Filters Panel (Desktop) -->
			{#if showAdvanced}
				<div class="hidden md:block border-t border-gray-100 py-4">
					<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							<!-- Price Range -->
							<div>
								<label class="label text-xs mb-1">Price Range (GBP)</label>
								<div class="flex items-center gap-2">
									<input type="number" placeholder="Min" bind:value={minPrice}
										class="input py-2 text-sm w-full" min="0" />
									<span class="text-gray-400">-</span>
									<input type="number" placeholder="Max" bind:value={maxPrice}
										class="input py-2 text-sm w-full" min="0" />
								</div>
							</div>

							<!-- Min Rating -->
							<div>
								<label class="label text-xs mb-1">Minimum Rating</label>
								<div class="flex items-center gap-1">
									{#each [1, 2, 3, 4, 5] as star}
										<button
											class="p-1"
											onclick={() => { minRating = minRating === star.toString() ? '' : star.toString(); applyFilters(); }}
										>
											<svg class="w-6 h-6 {parseInt(minRating || '0') >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}"
												viewBox="0 0 20 20" fill="currentColor">
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
											</svg>
										</button>
									{/each}
									{#if minRating}
										<span class="text-sm text-gray-500 ml-2">{minRating}+ stars</span>
									{/if}
								</div>
							</div>

							<!-- Available Date -->
							<div>
								<label class="label text-xs mb-1">Available On</label>
								<input type="date" bind:value={availableDate}
									onchange={applyFilters}
									class="input py-2 text-sm w-full"
									min={new Date().toISOString().split('T')[0]} />
							</div>

							<!-- Verification Filter -->
							<div>
								<label class="label text-xs mb-1">Verification</label>
								<select bind:value={verified} onchange={applyFilters} class="input py-2 text-sm w-full">
									<option value="all">All Verified</option>
									<option value="insured">Insured</option>
									<option value="verified_pro">Verified Pro (Equity)</option>
								</select>
							</div>
						</div>

						<div class="flex justify-between items-center mt-4">
							<button class="btn-primary text-sm px-4 py-2" onclick={applyFilters}>
								Apply Price Filters
							</button>
							<button class="btn-outline text-sm px-4 py-2" onclick={clearAdvancedFilters}>
								Clear Advanced Filters
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Geo Search Active Banner -->
	{#if data.isGeoSearch}
		<div class="bg-primary/5 border-b border-primary/10">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2 text-sm">
						<svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						<span class="text-gray-700">
							Showing performers within
							<span class="font-semibold text-primary">{data.filters.radius} miles</span>
							of your location
						</span>
					</div>
					<button
						onclick={clearGeoSearch}
						class="text-sm text-gray-500 hover:text-gray-700 underline"
					>
						Clear location filter
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Results Grid -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if isLoadingPerformers}
			<!-- Skeleton loading state for client-side navigation -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each Array(6) as _}
					<SkeletonCard />
				{/each}
			</div>
		{:else if data.performers.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each data.performers as performer}
					<div class="relative">
						<PerformerCard {performer} />
						{#if performer.distance_miles !== null && performer.distance_miles !== undefined}
							<div class="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-medium text-secondary shadow-sm border border-gray-100 flex items-center gap-1 z-10">
								<svg class="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								</svg>
								{performer.distance_miles < 1
									? '< 1 mile'
									: `${performer.distance_miles} mi`}
							</div>
						{/if}
					</div>
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
					{#if data.isGeoSearch}
						No performers found within {data.filters.radius} miles of your location. Try increasing the search radius or clearing the location filter.
					{:else}
						We couldn't find any performers matching your criteria. Try adjusting your filters or search terms.
					{/if}
				</p>
				<div class="flex items-center justify-center gap-3">
					{#if data.isGeoSearch}
						<button class="btn-outline btn-md px-6" onclick={clearGeoSearch}>
							Clear location
						</button>
					{/if}
					<button class="btn-primary btn-md px-6" onclick={clearFilters}>
						Clear all filters
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
