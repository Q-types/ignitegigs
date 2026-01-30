<script lang="ts">
	import { Rating, Badge, Avatar, Modal, VideoCard, ShareButtons } from '$lib/components/ui';
	import { page } from '$app/stores';
	import { VideoGallery } from '$lib/components/performer';
	import JsonLd from '$lib/components/JsonLd.svelte';
	import type { PerformerProfile, PerformerMedia, Availability } from '$lib/types/database';

	interface PerformerPageData {
		performer: PerformerProfile & { user?: { id: string; full_name: string; avatar_url: string | null; email: string } };
		media: PerformerMedia[];
		reviews: Array<{
			id: string;
			rating: number;
			content: string | null;
			created_at: string;
			reviewer?: { id: string; full_name: string; avatar_url: string | null };
		}>;
		availability: Availability[];
		isSaved: boolean;
		isOwnProfile: boolean;
	}

	let { data }: { data: PerformerPageData } = $props();

	let showBookingModal = $state(false);
	let showContactModal = $state(false);
	let activeTab = $state<'about' | 'reviews' | 'availability'>('about');
	let selectedMediaIndex = $state<number | null>(null);

	let performer = $derived(data.performer);
	let primaryVideo = $derived(data.media.find((m) => m.media_type === 'video' && m.is_primary));
	let videos = $derived(data.media.filter((m) => m.media_type === 'video'));
	let photos = $derived(data.media.filter((m) => m.media_type === 'photo'));

	let performerSchema = $derived(
		Object.fromEntries(
			Object.entries({
				'@context': 'https://schema.org',
				'@type': 'PerformingGroup',
				name: performer.stage_name || performer.user?.full_name,
				description: performer.tagline || performer.bio?.slice(0, 250),
				url: $page.url.href,
				image: photos[0]?.url,
				address: performer.location_name
					? { '@type': 'PostalAddress', addressLocality: performer.location_name }
					: undefined,
				priceRange: performer.min_rate_pence
					? `From \u00a3${(performer.min_rate_pence / 100).toFixed(0)}`
					: undefined,
				aggregateRating:
					performer.avg_rating && performer.total_reviews
						? {
								'@type': 'AggregateRating',
								ratingValue: performer.avg_rating,
								reviewCount: performer.total_reviews,
								bestRating: 5,
								worstRating: 1
							}
						: undefined
			}).filter(([, v]) => v !== undefined)
		) as Record<string, unknown>
	);

	function formatPrice(pence: number | null): string {
		if (!pence) return 'Contact for rates';
		return `£${(pence / 100).toLocaleString()}`;
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function getAvailabilityStatus(date: string): 'available' | 'booked' | 'unavailable' | 'unknown' {
		const avail = data.availability.find((a) => a.date === date);
		if (!avail) return 'unknown';
		if (avail.is_booked) return 'booked';
		if (avail.is_available) return 'available';
		return 'unavailable';
	}
</script>

<svelte:head>
	<title>{performer.stage_name || performer.user?.full_name} - IgniteGigs</title>
	<meta
		name="description"
		content="{performer.tagline || performer.bio?.slice(0, 160) || 'Book this amazing performer for your event on IgniteGigs.'}"
	/>
</svelte:head>

<JsonLd schema={performerSchema} />

<div class="min-h-screen bg-gray-50">
	<!-- Hero Section with Video/Image -->
	<div class="relative bg-secondary">
		<div class="max-w-7xl mx-auto">
			<div class="grid lg:grid-cols-2 gap-0">
				<!-- Media Section -->
				<div class="relative aspect-video lg:aspect-auto lg:h-[500px]">
					{#if primaryVideo}
						<video
							src={primaryVideo.url}
							poster={primaryVideo.thumbnail_url || undefined}
							controls
							fetchpriority="high"
							class="w-full h-full object-cover"
						>
							<track kind="captions" />
						</video>
					{:else if photos[0]}
						<img
							src={photos[0].url}
							alt={performer.stage_name || 'Performer'}
							fetchpriority="high"
							class="w-full h-full object-cover"
						/>
					{:else}
						<div class="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
							<svg class="w-24 h-24 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
							</svg>
						</div>
					{/if}
				</div>

				<!-- Info Section -->
				<div class="p-6 lg:p-10 flex flex-col justify-center text-white">
					<div class="flex items-start justify-between gap-4 mb-4">
						<div>
							<!-- Category Badges -->
							<div class="flex gap-2 mb-3">
								{#if performer.performer_category?.includes('fire')}
									<span class="badge-fire">Fire</span>
								{/if}
								{#if performer.performer_category?.includes('led')}
									<span class="badge-led">LED</span>
								{/if}
								{#if performer.is_verified}
									<span class="badge-verified">Verified</span>
								{/if}
							</div>

							<h1 class="font-display text-3xl lg:text-4xl font-bold mb-2">
								{performer.stage_name || performer.user?.full_name}
							</h1>

							{#if performer.tagline}
								<p class="text-lg text-white/80">{performer.tagline}</p>
							{/if}
						</div>

						<!-- Save Button -->
						{#if !data.isOwnProfile}
							<button
								class="p-3 rounded-full {data.isSaved ? 'bg-primary text-white' : 'bg-white/10 text-white hover:bg-white/20'} transition-colors"
								aria-label={data.isSaved ? 'Unsave performer' : 'Save performer'}
							>
								<svg class="w-6 h-6" fill={data.isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
									/>
								</svg>
							</button>
						{/if}
					</div>

					<!-- Stats Row -->
					<div class="flex flex-wrap items-center gap-4 mb-6 text-sm">
						<div class="flex items-center gap-1">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							</svg>
							{performer.location_name}
						</div>
						{#if performer.travel_radius_miles > 0}
							<span class="text-white/60">Travels up to {performer.travel_radius_miles} miles</span>
						{/if}
					</div>

					<!-- Rating -->
					<div class="flex items-center gap-3 mb-6">
						{#if performer.total_reviews > 0}
							<div class="flex items-center gap-2">
								<Rating value={performer.avg_rating} size="md" />
								<span class="font-semibold">{performer.avg_rating.toFixed(1)}</span>
								<span class="text-white/70">({performer.total_reviews} reviews)</span>
							</div>
						{:else}
							<span class="text-white/70">New performer - be the first to book!</span>
						{/if}
					</div>

					<!-- Price -->
					<div class="mb-8">
						<span class="text-white/70 text-sm">Starting from</span>
						<p class="font-display text-3xl font-bold text-primary">
							{formatPrice(performer.min_rate_pence || performer.hourly_rate_pence)}
						</p>
					</div>

					<!-- CTA Buttons -->
					{#if !data.isOwnProfile}
						<div class="flex flex-col sm:flex-row gap-3">
							<a
								href="/book/{performer.id}"
								class="btn-primary btn-lg flex-1 text-center"
							>
								Request Booking
							</a>
							<button
								class="btn bg-white/10 hover:bg-white/20 text-white btn-lg flex-1"
								onclick={() => (showContactModal = true)}
							>
								Send Message
							</button>
						</div>
					{:else}
						<a href="/dashboard/profile" class="btn-primary btn-lg text-center">
							Edit Profile
						</a>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
		<div class="grid lg:grid-cols-3 gap-8">
			<!-- Main Column -->
			<div class="lg:col-span-2 space-y-8">
				<!-- Tabs -->
				<div class="bg-white rounded-card shadow-card overflow-hidden">
					<div class="border-b border-gray-200">
						<nav class="flex">
							{#each [
								{ id: 'about', label: 'About' },
								{ id: 'reviews', label: `Reviews (${performer.total_reviews})` },
								{ id: 'availability', label: 'Availability' }
							] as tab}
								<button
									class="flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors {activeTab === tab.id
										? 'border-primary text-primary'
										: 'border-transparent text-gray-500 hover:text-gray-700'}"
									onclick={() => (activeTab = tab.id as typeof activeTab)}
								>
									{tab.label}
								</button>
							{/each}
						</nav>
					</div>

					<div class="p-6">
						{#if activeTab === 'about'}
							<!-- Bio -->
							{#if performer.bio}
								<div class="prose max-w-none mb-8">
									<h3 class="font-display text-lg font-semibold text-secondary mb-3">About</h3>
									<p class="text-gray-600 whitespace-pre-line">{performer.bio}</p>
								</div>
							{/if}

							<!-- Act Types -->
							{#if performer.act_types?.length > 0}
								<div class="mb-8">
									<h3 class="font-display text-lg font-semibold text-secondary mb-3">Act Types</h3>
									<div class="flex flex-wrap gap-2">
										{#each performer.act_types as actType}
											<span class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
												{actType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
											</span>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Verification Badges -->
							{#if performer.verification_badges?.length > 0}
								<div>
									<h3 class="font-display text-lg font-semibold text-secondary mb-3">Verifications</h3>
									<div class="flex flex-wrap gap-3">
										{#each performer.verification_badges as badge}
											<div class="flex items-center gap-2 px-3 py-2 bg-success/10 text-success rounded-lg text-sm">
												<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
													<path
														fill-rule="evenodd"
														d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
														clip-rule="evenodd"
													/>
												</svg>
												{badge.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
											</div>
										{/each}
									</div>
								</div>
							{/if}
						{:else if activeTab === 'reviews'}
							{#if data.reviews.length > 0}
								<div class="space-y-6">
									{#each data.reviews as review}
										<div class="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
											<div class="flex items-start gap-4">
												<Avatar
													src={review.reviewer?.avatar_url}
													name={review.reviewer?.full_name || 'Anonymous'}
													size="md"
												/>
												<div class="flex-1">
													<div class="flex items-center justify-between mb-2">
														<div>
															<p class="font-medium text-gray-900">{review.reviewer?.full_name || 'Anonymous'}</p>
															<p class="text-sm text-gray-500">{formatDate(review.created_at)}</p>
														</div>
														<Rating value={review.rating} size="sm" />
													</div>
													{#if review.content}
														<p class="text-gray-600">{review.content}</p>
													{/if}
												</div>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<div class="text-center py-8">
									<p class="text-gray-500">No reviews yet. Be the first to book and leave a review!</p>
								</div>
							{/if}
						{:else if activeTab === 'availability'}
							<div>
								<p class="text-sm text-gray-500 mb-4">
									Calendar shows availability for the next 60 days. Green = available, Red = booked, Gray = unavailable.
								</p>
								<div class="grid grid-cols-7 gap-2 text-center">
									{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
										<div class="text-xs font-medium text-gray-500 py-2">{day}</div>
									{/each}
									{#each Array(60) as _, i}
										{@const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000)}
										{@const dateStr = date.toISOString().split('T')[0]}
										{@const status = getAvailabilityStatus(dateStr)}
										{@const dayOfWeek = date.getDay()}
										{#if i === 0}
											{#each Array(dayOfWeek) as _}
												<div></div>
											{/each}
										{/if}
										<button
											class="aspect-square rounded-lg text-sm font-medium transition-colors {status === 'available'
												? 'bg-success/20 text-success hover:bg-success/30'
												: status === 'booked'
													? 'bg-error/20 text-error'
													: status === 'unavailable'
														? 'bg-gray-100 text-gray-400'
														: 'bg-gray-50 text-gray-600 hover:bg-gray-100'}"
											disabled={status === 'booked' || status === 'unavailable'}
										>
											{date.getDate()}
										</button>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Media Gallery -->
				{#if data.media.length > 0}
					<div class="bg-white rounded-card shadow-card p-6">
						<h3 class="font-display text-lg font-semibold text-secondary mb-4">
							Gallery ({data.media.length})
						</h3>
						<VideoGallery media={data.media} />
					</div>
				{/if}
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Quick Info Card -->
				<div class="bg-white rounded-card shadow-card p-6">
					<h3 class="font-display text-lg font-semibold text-secondary mb-4">Quick Info</h3>
					<div class="space-y-4">
						<div class="flex justify-between">
							<span class="text-gray-500">Response rate</span>
							<span class="font-medium">{performer.response_rate}%</span>
						</div>
						{#if performer.response_time_hours}
							<div class="flex justify-between">
								<span class="text-gray-500">Response time</span>
								<span class="font-medium">
									{performer.response_time_hours < 24
										? `${performer.response_time_hours}h`
										: `${Math.round(performer.response_time_hours / 24)}d`}
								</span>
							</div>
						{/if}
						<div class="flex justify-between">
							<span class="text-gray-500">Total bookings</span>
							<span class="font-medium">{performer.total_bookings}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Member since</span>
							<span class="font-medium">{formatDate(performer.created_at)}</span>
						</div>
					</div>
				</div>

				<!-- Pricing Card -->
				<div class="bg-white rounded-card shadow-card p-6">
					<h3 class="font-display text-lg font-semibold text-secondary mb-4">Pricing</h3>
					<div class="space-y-3">
						{#if performer.hourly_rate_pence}
							<div class="flex justify-between items-center">
								<span class="text-gray-600">Hourly rate</span>
								<span class="font-display font-bold text-lg">{formatPrice(performer.hourly_rate_pence)}</span>
							</div>
						{/if}
						{#if performer.event_rate_pence}
							<div class="flex justify-between items-center">
								<span class="text-gray-600">Event rate</span>
								<span class="font-display font-bold text-lg">{formatPrice(performer.event_rate_pence)}</span>
							</div>
						{/if}
						{#if performer.min_rate_pence}
							<div class="flex justify-between items-center text-sm">
								<span class="text-gray-500">Minimum booking</span>
								<span class="text-gray-700">{formatPrice(performer.min_rate_pence)}</span>
							</div>
						{/if}
					</div>
					<p class="text-xs text-gray-400 mt-4">
						Final pricing depends on event details. Request a quote for accurate pricing.
					</p>
				</div>

				<!-- Share -->
				<div class="bg-white rounded-card shadow-card p-6">
					<h3 class="font-display text-lg font-semibold text-secondary mb-4">Share</h3>
					<ShareButtons
						url={$page.url.href}
						title="{performer.stage_name || performer.user?.full_name} - IgniteGigs"
						description={performer.tagline || performer.bio?.slice(0, 160) || 'Check out this performer on IgniteGigs!'}
					/>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Contact Modal -->
<Modal bind:open={showContactModal} title="Send Message">
	<form class="space-y-4">
		<div>
			<label for="message" class="label">Your message</label>
			<textarea
				id="message"
				rows="4"
				class="input"
				placeholder="Hi! I'm interested in booking you for..."
			></textarea>
		</div>
		<div class="flex gap-3">
			<button type="button" class="btn-outline flex-1" onclick={() => (showContactModal = false)}>
				Cancel
			</button>
			<button type="submit" class="btn-primary flex-1">
				Send Message
			</button>
		</div>
	</form>
</Modal>
