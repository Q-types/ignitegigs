<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		error = null,
		fallback,
		onRetry,
		title = 'Something went wrong'
	}: {
		children: Snippet;
		error?: string | null;
		fallback?: Snippet<[string]>;
		onRetry?: () => void;
		title?: string;
	} = $props();
</script>

{#if error}
	{#if fallback}
		{@render fallback(error)}
	{:else}
		<div class="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
			<div class="w-10 h-10 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
				<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
				</svg>
			</div>
			<p class="text-sm font-medium text-red-800 mb-1">{title}</p>
			<p class="text-sm text-red-600">{error}</p>
			{#if onRetry}
				<button
					onclick={onRetry}
					class="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
					Try Again
				</button>
			{/if}
		</div>
	{/if}
{:else}
	{@render children()}
{/if}
