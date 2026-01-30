<script lang="ts">
	import Skeleton from './Skeleton.svelte';

	let {
		lines = 3
	}: {
		lines?: number;
	} = $props();

	const lineWidths = ['100%', '90%', '75%', '85%', '60%', '95%', '70%', '80%'];

	function getLineWidth(index: number): string {
		return lineWidths[index % lineWidths.length];
	}
</script>

<div class="space-y-2">
	{#each Array(lines) as _, index}
		<Skeleton width={getLineWidth(index)} height="0.75rem" rounded="rounded" />
	{/each}
</div>
