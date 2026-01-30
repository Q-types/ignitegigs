<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let {
		open = $bindable(false),
		title = '',
		children
	}: {
		open: boolean;
		title: string;
		children: Snippet;
	} = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			open = false;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-black/50"
		transition:fade={{ duration: 200 }}
		onclick={() => (open = false)}
		role="presentation"
	>
		<!-- Modal Container -->
		<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<!-- Modal Card -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="bg-white rounded-card shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
				transition:fly={{ y: 20, duration: 300 }}
				onclick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-label={title || 'Dialog'}
			>
				<!-- Header -->
				{#if title}
					<div class="flex items-center justify-between p-6 pb-0">
						<h2 class="font-display text-lg font-semibold text-secondary">{title}</h2>
						<button
							type="button"
							class="text-gray-400 hover:text-gray-600 transition-colors"
							onclick={() => (open = false)}
							aria-label="Close"
						>
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				{:else}
					<div class="flex justify-end p-6 pb-0">
						<button
							type="button"
							class="text-gray-400 hover:text-gray-600 transition-colors"
							onclick={() => (open = false)}
							aria-label="Close"
						>
							<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				{/if}

				<!-- Body -->
				<div class="p-6">
					{@render children()}
				</div>
			</div>
		</div>
	</div>
{/if}
