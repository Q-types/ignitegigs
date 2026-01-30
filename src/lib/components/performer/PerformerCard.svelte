<script lang="ts">
	import type { PerformerProfile, PerformerMedia } from '$types/database';

	interface Props {
		performer: PerformerProfile & {
			primary_media?: PerformerMedia | null;
			user?: { full_name: string; avatar_url: string | null } | null;
		};
	}

	let { performer }: Props = $props();

	let isHovering = $state(false);
	let videoRef: HTMLVideoElement | null = $state(null);

	// Format price from pence to pounds
	function formatPrice(pence: number | null): string {
		if (!pence) return 'POA';
		return `£${(pence / 100).toFixed(0)}`;
	}

	// Get price range display
	function getPriceRange(): string {
		const min = performer.min_rate_pence;
		const eventRate = performer.event_rate_pence;
		const showRate = performer.show_rate_pence;
		const lowest = min || showRate || eventRate;
		const highest = eventRate || showRate || min;
		if (lowest && highest && lowest !== highest) {
			return `${formatPrice(lowest)} - ${formatPrice(highest)}`;
		}
		return formatPrice(lowest || highest);
	}

	// Get category label
	function getCategoryLabel(): string {
		const categories = performer.performer_category || [];
		if (categories.includes('fire') && categories.includes('led')) return 'Fire & LED';
		if (categories.includes('fire')) return 'Fire';
		if (categories.includes('led')) return 'LED';
		if (categories.includes('circus')) return 'Circus';
		if (categories.includes('aerial')) return 'Aerial';
		if (categories.includes('dance')) return 'Dance';
		if (categories.includes('juggling')) return 'Juggling';
		if (categories.includes('acrobatics')) return 'Acrobatics';
		if (categories.includes('magic')) return 'Magic';
		if (categories.includes('comedy')) return 'Comedy';
		if (categories.includes('walkabout')) return 'Walkabout';
		if (categories.includes('caricature')) return 'Caricature';
		if (categories.includes('stilt')) return 'Stilt Walking';
		return 'Performer';
	}

	// Format act types for display
	function formatActType(actType: string): string {
		return actType
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	// Handle hover for video playback
	$effect(() => {
		if (videoRef) {
			if (isHovering) {
				videoRef.play().catch(() => {});
			} else {
				videoRef.pause();
				videoRef.currentTime = 0;
			}
		}
	});
</script>

<a
	href="/performers/{performer.id}"
	class="group block card-hover transform transition-all duration-300 hover:-translate-y-1"
	role="article"
	onmouseenter={() => (isHovering = true)}
	onmouseleave={() => (isHovering = false)}
>
	<!-- Media Section -->
	<div class="relative aspect-[4/3] bg-gray-100 overflow-hidden">
		{#if performer.primary_media?.media_type === 'video'}
			<!-- Video thumbnail with play on hover -->
			<video
				bind:this={videoRef}
				src={performer.primary_media.url}
				poster={performer.primary_media.thumbnail_url || undefined}
				muted
				loop
				playsinline
				class="w-full h-full object-cover"
			>
				<track kind="captions" />
			</video>
			<!-- Play indicator -->
			<div
				class="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 {isHovering
					? 'opacity-0'
					: 'opacity-100'}"
			>
				<div class="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
					<svg class="w-5 h-5 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
						<path d="M8 5v14l11-7z" />
					</svg>
				</div>
			</div>
		{:else if performer.primary_media?.thumbnail_url || performer.primary_media?.url}
			<img
				src={performer.primary_media.thumbnail_url || performer.primary_media.url}
				alt={performer.stage_name || 'Performer'}
				loading="lazy"
				decoding="async"
				class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
			/>
		{:else}
			<!-- Placeholder -->
			<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
				<svg class="w-16 h-16 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
					/>
				</svg>
			</div>
		{/if}

		<!-- Category Badge -->
		<div class="absolute top-3 left-3">
			{#if performer.performer_category?.includes('fire') && performer.performer_category?.includes('led')}
				<span class="badge bg-gradient-to-r from-orange-500 to-purple-500 text-white">Fire & LED</span>
			{:else if performer.performer_category?.includes('fire')}
				<span class="badge-fire">Fire</span>
			{:else if performer.performer_category?.includes('led')}
				<span class="badge-led">LED</span>
			{:else if performer.performer_category?.length > 0}
				<span class="badge bg-secondary/90 text-white">{getCategoryLabel()}</span>
			{/if}
		</div>

		<!-- Verified Badge -->
		{#if performer.is_verified}
			<div class="absolute top-3 right-3">
				<span class="badge-verified flex items-center gap-1">
					<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
							clip-rule="evenodd"
						/>
					</svg>
					Verified
				</span>
			</div>
		{/if}
	</div>

	<!-- Content Section -->
	<div class="p-4">
		<!-- Stage Name & Location -->
		<div class="flex items-start justify-between gap-2 mb-2">
			<div class="min-w-0">
				<h3 class="font-display font-semibold text-lg text-gray-900 truncate group-hover:text-primary transition-colors">
					{performer.stage_name || performer.user?.full_name || 'Performer'}
				</h3>
				<p class="text-sm text-gray-500 flex items-center gap-1">
					<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					<span class="truncate">{performer.location_name}</span>
				</p>
			</div>
		</div>

		<!-- Rating -->
		<div class="flex items-center gap-2 mb-3">
			{#if performer.total_reviews > 0}
				<div class="flex items-center gap-1">
					<svg class="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
					<span class="font-semibold text-gray-900">{performer.avg_rating.toFixed(1)}</span>
					<span class="text-gray-500 text-sm">({performer.total_reviews})</span>
				</div>
			{:else}
				<span class="text-sm text-gray-400">New performer</span>
			{/if}
		</div>

		<!-- Act Types -->
		<div class="flex flex-wrap gap-1.5 mb-3">
			{#each (performer.act_types || []).slice(0, 3) as actType}
				<span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
					{formatActType(actType)}
				</span>
			{/each}
			{#if (performer.act_types || []).length > 3}
				<span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
					+{performer.act_types.length - 3} more
				</span>
			{/if}
		</div>

		<!-- Price -->
		<div class="flex items-center justify-between pt-3 border-t border-gray-100">
			<span class="text-sm text-gray-500">From</span>
			<span class="font-display font-semibold text-lg text-primary">{getPriceRange()}</span>
		</div>
	</div>
</a>
