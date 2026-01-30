<script lang="ts">
	interface Props {
		src: string;
		alt: string;
		class?: string;
		width?: number | string;
		height?: number | string;
	}

	let { src, alt, class: className = '', width, height }: Props = $props();

	let containerRef: HTMLDivElement | null = $state(null);
	let isInViewport = $state(false);
	let isLoaded = $state(false);

	$effect(() => {
		if (!containerRef) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					isInViewport = true;
					observer.disconnect();
				}
			},
			{ rootMargin: '200px' }
		);

		observer.observe(containerRef);

		return () => observer.disconnect();
	});
</script>

<div
	bind:this={containerRef}
	class="lazy-image-wrapper {className}"
	style:width={width ? (typeof width === 'number' ? `${width}px` : width) : undefined}
	style:height={height ? (typeof height === 'number' ? `${height}px` : height) : undefined}
>
	{#if !isInViewport || !isLoaded}
		<div class="lazy-image-placeholder" aria-hidden="true"></div>
	{/if}
	{#if isInViewport}
		<img
			{src}
			{alt}
			loading="lazy"
			decoding="async"
			width={width || undefined}
			height={height || undefined}
			class="lazy-image-el {isLoaded ? 'lazy-image-visible' : 'lazy-image-hidden'}"
			onload={() => (isLoaded = true)}
		/>
	{/if}
</div>

<style>
	.lazy-image-wrapper {
		position: relative;
		overflow: hidden;
	}

	.lazy-image-placeholder {
		position: absolute;
		inset: 0;
		background-color: #e5e7eb;
		animation: lazy-pulse 1.5s ease-in-out infinite;
	}

	@keyframes lazy-pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.6; }
	}

	.lazy-image-el {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: opacity 0.3s ease-in;
	}

	.lazy-image-hidden {
		opacity: 0;
	}

	.lazy-image-visible {
		opacity: 1;
	}
</style>
