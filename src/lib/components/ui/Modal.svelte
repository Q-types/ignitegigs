<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		onClose?: () => void;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		children: Snippet;
		footer?: Snippet;
	}

	let {
		open = $bindable(false),
		onClose,
		title,
		size = 'md',
		closeOnBackdrop = true,
		closeOnEscape = true,
		children,
		footer
	}: Props = $props();

	function close() {
		open = false;
		onClose?.();
	}

	const sizeClasses: Record<NonNullable<Props['size']>, string> = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl'
	};

	function handleBackdropClick(event: MouseEvent) {
		if (closeOnBackdrop && event.target === event.currentTarget) {
			close();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (closeOnEscape && event.key === 'Escape') {
			close();
		}
	}

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? 'modal-title' : undefined}
	>
		<!-- Backdrop -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute inset-0 bg-black/50 animate-fade-in"
			onclick={handleBackdropClick}
		></div>

		<!-- Modal content -->
		<div
			class="relative bg-white rounded-card shadow-xl w-full {sizeClasses[size]} animate-slide-up"
		>
			{#if title}
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
					<h2 id="modal-title" class="text-lg font-semibold text-secondary">{title}</h2>
					<button
						type="button"
						class="text-gray-400 hover:text-gray-600 transition-colors"
						onclick={close}
						aria-label="Close modal"
					>
						<svg
							class="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</button>
				</div>
			{/if}

			<div class="px-6 py-4">
				{@render children()}
			</div>

			{#if footer}
				<div class="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-card">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
