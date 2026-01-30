<script lang="ts">
	let {
		media
	}: {
		media: Array<{
			id: string;
			url: string;
			media_type: string;
			thumbnail_url?: string | null;
			title?: string | null;
			is_primary?: boolean;
		}>;
	} = $props();
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
	{#each media as item (item.id)}
		{#if item.media_type === 'video'}
			<div class="aspect-video rounded-lg overflow-hidden bg-gray-900 relative group cursor-pointer">
				<video
					src={item.url}
					class="w-full h-full object-cover"
					preload="metadata"
					poster={item.thumbnail_url ?? undefined}
				>
					<track kind="captions" />
				</video>

				<!-- Play Button Overlay -->
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
						<svg class="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
						</svg>
					</div>
				</div>
			</div>
		{:else if item.media_type === 'photo'}
			<div class="aspect-video rounded-lg overflow-hidden">
				<img
					src={item.url}
					alt={item.title ?? ''}
					class="w-full h-full object-cover"
				/>
			</div>
		{/if}
	{/each}
</div>
