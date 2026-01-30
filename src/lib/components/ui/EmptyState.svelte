<script lang="ts">
	let {
		icon,
		title,
		description = '',
		actionLabel = '',
		actionHref = '',
		onAction
	}: {
		icon?: string;
		title: string;
		description?: string;
		actionLabel?: string;
		actionHref?: string;
		onAction?: () => void;
	} = $props();
</script>

<div class="flex flex-col items-center justify-center py-12 px-4 text-center">
	{#if icon}
		<div class="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
			<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={icon} />
			</svg>
		</div>
	{/if}

	<h3 class="text-lg font-semibold text-secondary mb-1">{title}</h3>

	{#if description}
		<p class="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
	{/if}

	{#if actionLabel && actionHref}
		<a href={actionHref} class="btn-primary btn-sm">
			{actionLabel}
		</a>
	{:else if actionLabel && onAction}
		<button onclick={onAction} class="btn-primary btn-sm">
			{actionLabel}
		</button>
	{/if}
</div>
