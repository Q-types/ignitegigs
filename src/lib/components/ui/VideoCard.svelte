<script lang="ts">
	let {
		url,
		thumbnailUrl = null,
		title = '',
		duration = null
	}: {
		url: string;
		thumbnailUrl: string | null | undefined;
		title: string;
		duration: string | null;
	} = $props();
</script>

<div class="relative aspect-video rounded-lg overflow-hidden bg-gray-900 group cursor-pointer">
	{#if thumbnailUrl}
		<img
			src={thumbnailUrl}
			alt={title}
			class="w-full h-full object-cover"
		/>
	{:else}
		<video
			src={url}
			class="w-full h-full object-cover"
			preload="metadata"
		>
			<track kind="captions" />
		</video>
	{/if}

	<!-- Play Button Overlay -->
	<div class="absolute inset-0 flex items-center justify-center">
		<div class="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
			<svg class="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
				<path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
			</svg>
		</div>
	</div>

	<!-- Duration Badge -->
	{#if duration}
		<span class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
			{duration}
		</span>
	{/if}
</div>
