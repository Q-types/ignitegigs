<script lang="ts">
	import Skeleton from './Skeleton.svelte';

	let {
		rows = 5,
		cols = 4
	}: {
		rows?: number;
		cols?: number;
	} = $props();

	const colWidths = ['70%', '50%', '60%', '40%', '55%', '45%'];

	function getWidth(colIndex: number, isHeader: boolean): string {
		if (isHeader) return '80%';
		return colWidths[colIndex % colWidths.length];
	}
</script>

<div class="w-full overflow-hidden rounded-lg border border-gray-200">
	<!-- Header row -->
	<div class="flex gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
		{#each Array(cols) as _, colIndex}
			<div class="flex-1">
				<Skeleton width={getWidth(colIndex, true)} height="0.875rem" rounded="rounded" />
			</div>
		{/each}
	</div>

	<!-- Body rows -->
	{#each Array(rows) as _, rowIndex}
		<div class="flex gap-4 px-4 py-3 {rowIndex < rows - 1 ? 'border-b border-gray-100' : ''}">
			{#each Array(cols) as _, colIndex}
				<div class="flex-1">
					<Skeleton width={getWidth(colIndex, false)} height="0.75rem" rounded="rounded" />
				</div>
			{/each}
		</div>
	{/each}
</div>
