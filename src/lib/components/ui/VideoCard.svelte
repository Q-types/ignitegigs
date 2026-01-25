<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		thumbnail: string;
		title: string;
		duration?: string;
		previewVideo?: string;
		onPlay?: () => void;
	}

	let {
		thumbnail,
		title,
		duration,
		previewVideo,
		onPlay,
		class: className = '',
		...restProps
	}: Props = $props();

	let isHovering = $state(false);
	let videoRef = $state<HTMLVideoElement | null>(null);

	function handleMouseEnter() {
		isHovering = true;
		if (previewVideo && videoRef) {
			videoRef.play().catch(() => {
				// Autoplay might be blocked
			});
		}
	}

	function handleMouseLeave() {
		isHovering = false;
		if (videoRef) {
			videoRef.pause();
			videoRef.currentTime = 0;
		}
	}

	function handleClick() {
		onPlay?.();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onPlay?.();
		}
	}

	const computedClasses = $derived(
		[
			'group relative aspect-video rounded-card overflow-hidden cursor-pointer bg-gray-900',
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={computedClasses}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onclick={handleClick}
	onkeydown={handleKeydown}
	role="button"
	tabindex="0"
	aria-label="Play {title}"
	{...restProps}
>
	<!-- Thumbnail -->
	<img
		src={thumbnail}
		alt={title}
		class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
		class:opacity-0={isHovering && previewVideo}
	/>

	<!-- Preview Video -->
	{#if previewVideo}
		<video
			bind:this={videoRef}
			src={previewVideo}
			class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
			class:opacity-0={!isHovering}
			muted
			loop
			playsinline
		></video>
	{/if}

	<!-- Gradient overlay -->
	<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

	<!-- Play button overlay -->
	<div
		class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
	>
		<div class="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
			<svg class="w-6 h-6 text-secondary ml-1" fill="currentColor" viewBox="0 0 24 24">
				<path d="M8 5v14l11-7z"></path>
			</svg>
		</div>
	</div>

	<!-- Info overlay -->
	<div class="absolute bottom-0 left-0 right-0 p-3">
		<h3 class="text-white font-medium text-sm truncate">{title}</h3>
		{#if duration}
			<span
				class="absolute bottom-3 right-3 px-2 py-0.5 bg-black/70 rounded text-white text-xs font-medium"
			>
				{duration}
			</span>
		{/if}
	</div>
</div>
