<script lang="ts">
	import type { PerformerMedia } from '$types/database';

	interface Props {
		media: PerformerMedia[];
		performerName?: string;
	}

	let { media, performerName = 'Performer' }: Props = $props();

	let selectedMedia: PerformerMedia | null = $state(null);
	let isModalOpen = $state(false);

	// Sort media - primary first, then by sort_order
	let sortedMedia = $derived(
		[...media].sort((a, b) => {
			if (a.is_primary && !b.is_primary) return -1;
			if (!a.is_primary && b.is_primary) return 1;
			return a.sort_order - b.sort_order;
		})
	);

	// Separate videos and photos
	let videos = $derived(sortedMedia.filter((m) => m.media_type === 'video'));
	let photos = $derived(sortedMedia.filter((m) => m.media_type === 'photo'));

	function openModal(mediaItem: PerformerMedia) {
		selectedMedia = mediaItem;
		isModalOpen = true;
		// Prevent body scroll when modal is open
		document.body.style.overflow = 'hidden';
	}

	function closeModal() {
		isModalOpen = false;
		selectedMedia = null;
		document.body.style.overflow = '';
	}

	// Handle escape key to close modal
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isModalOpen) {
			closeModal();
		}
	}

	// Navigate to next/prev media in modal
	function navigateMedia(direction: 'prev' | 'next') {
		if (!selectedMedia) return;
		const currentIndex = sortedMedia.findIndex((m) => m.id === selectedMedia?.id);
		if (currentIndex === -1) return;

		let newIndex: number;
		if (direction === 'next') {
			newIndex = currentIndex + 1 >= sortedMedia.length ? 0 : currentIndex + 1;
		} else {
			newIndex = currentIndex - 1 < 0 ? sortedMedia.length - 1 : currentIndex - 1;
		}
		selectedMedia = sortedMedia[newIndex];
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if videos.length > 0}
	<section class="mb-10">
		<h2 class="font-display text-2xl font-semibold text-gray-900 mb-6">Videos</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each videos as video, index (video.id)}
				<button
					type="button"
					onclick={() => openModal(video)}
					class="group relative aspect-video rounded-lg overflow-hidden bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 {video.is_primary
						? 'sm:col-span-2 sm:row-span-2'
						: ''}"
				>
					<!-- Thumbnail -->
					{#if video.thumbnail_url}
						<img
							src={video.thumbnail_url}
							alt={video.title || `${performerName} video ${index + 1}`}
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						/>
					{:else}
						<div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
							<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
								/>
							</svg>
						</div>
					{/if}

					<!-- Overlay with play button -->
					<div class="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
						<div class="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
							<svg class="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8 5v14l11-7z" />
							</svg>
						</div>
					</div>

					<!-- Primary badge -->
					{#if video.is_primary}
						<div class="absolute top-3 left-3">
							<span class="badge bg-primary text-white">Featured</span>
						</div>
					{/if}

					<!-- Duration badge -->
					{#if video.duration_seconds}
						<div class="absolute bottom-3 right-3">
							<span class="px-2 py-1 bg-black/70 text-white text-xs rounded">
								{Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}
							</span>
						</div>
					{/if}

					<!-- Title -->
					{#if video.title}
						<div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
							<p class="text-white text-sm font-medium truncate">{video.title}</p>
						</div>
					{/if}
				</button>
			{/each}
		</div>
	</section>
{/if}

{#if photos.length > 0}
	<section>
		<h2 class="font-display text-2xl font-semibold text-gray-900 mb-6">Photos</h2>

		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
			{#each photos as photo, index (photo.id)}
				<button
					type="button"
					onclick={() => openModal(photo)}
					class="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
				>
					<img
						src={photo.url}
						alt={photo.title || `${performerName} photo ${index + 1}`}
						class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					/>

					<!-- Hover overlay -->
					<div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>

					<!-- Primary badge -->
					{#if photo.is_primary}
						<div class="absolute top-2 left-2">
							<span class="badge bg-primary text-white text-xs">Featured</span>
						</div>
					{/if}
				</button>
			{/each}
		</div>
	</section>
{/if}

{#if media.length === 0}
	<div class="text-center py-12 px-4 rounded-lg bg-gray-50">
		<svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
				d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
			/>
		</svg>
		<p class="text-gray-500">No media uploaded yet</p>
	</div>
{/if}

<!-- Video/Photo Modal -->
{#if isModalOpen && selectedMedia}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center"
		role="dialog"
		aria-modal="true"
		aria-label="Media viewer"
	>
		<!-- Backdrop -->
		<button
			type="button"
			class="absolute inset-0 bg-black/90"
			onclick={closeModal}
			aria-label="Close modal"
		></button>

		<!-- Close button -->
		<button
			type="button"
			onclick={closeModal}
			class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
			aria-label="Close"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>

		<!-- Navigation buttons -->
		{#if sortedMedia.length > 1}
			<button
				type="button"
				onclick={() => navigateMedia('prev')}
				class="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
				aria-label="Previous"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			<button
				type="button"
				onclick={() => navigateMedia('next')}
				class="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
				aria-label="Next"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		{/if}

		<!-- Media content -->
		<div class="relative max-w-5xl max-h-[90vh] mx-4">
			{#if selectedMedia.media_type === 'video'}
				<video
					src={selectedMedia.url}
					controls
					autoplay
					class="max-w-full max-h-[90vh] rounded-lg"
				>
					<track kind="captions" />
					Your browser does not support video playback.
				</video>
			{:else}
				<img
					src={selectedMedia.url}
					alt={selectedMedia.title || 'Photo'}
					class="max-w-full max-h-[90vh] rounded-lg object-contain"
				/>
			{/if}

			<!-- Media info -->
			{#if selectedMedia.title || selectedMedia.description}
				<div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-lg">
					{#if selectedMedia.title}
						<h3 class="text-white font-semibold">{selectedMedia.title}</h3>
					{/if}
					{#if selectedMedia.description}
						<p class="text-white/80 text-sm mt-1">{selectedMedia.description}</p>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Counter -->
		<div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
			{sortedMedia.findIndex((m) => m.id === selectedMedia?.id) + 1} / {sortedMedia.length}
		</div>
	</div>
{/if}
