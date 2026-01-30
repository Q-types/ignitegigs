<script lang="ts">
	let { src = null, name = '', size = 'md' }: { src: string | null | undefined; name: string; size: 'sm' | 'md' | 'lg' } = $props();

	let imgError = $state(false);

	$effect(() => {
		src;
		imgError = false;
	});

	const sizeClasses: Record<string, string> = {
		sm: 'w-8 h-8 text-xs',
		md: 'w-10 h-10 text-sm',
		lg: 'w-14 h-14 text-base'
	};

	const initials = $derived(
		name
			.split(' ')
			.map((word) => word.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2) || '?'
	);
</script>

{#if src && !imgError}
	<img
		src={src}
		alt={name}
		class="rounded-full object-cover flex-shrink-0 {sizeClasses[size]}"
		onerror={() => (imgError = true)}
	/>
{:else}
	<div
		class="rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center flex-shrink-0 {sizeClasses[size]}"
	>
		{initials}
	</div>
{/if}
