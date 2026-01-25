<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
	type ButtonSize = 'sm' | 'md' | 'lg';

	interface Props extends HTMLButtonAttributes {
		variant?: ButtonVariant;
		size?: ButtonSize;
		loading?: boolean;
		disabled?: boolean;
		fullWidth?: boolean;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		fullWidth = false,
		children,
		class: className = '',
		...restProps
	}: Props = $props();

	const baseClasses =
		'inline-flex items-center justify-center font-semibold rounded-button transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

	const variantClasses: Record<ButtonVariant, string> = {
		primary:
			'bg-primary text-white hover:bg-primary-hover active:bg-primary-active focus:ring-primary disabled:bg-primary/50',
		secondary:
			'border-2 border-primary text-primary bg-transparent hover:bg-primary-light active:bg-primary-light/80 focus:ring-primary disabled:border-primary/50 disabled:text-primary/50',
		ghost:
			'text-secondary bg-transparent hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300 disabled:text-secondary/50',
		danger:
			'bg-error text-white hover:bg-error/90 active:bg-error/80 focus:ring-error disabled:bg-error/50'
	};

	const sizeClasses: Record<ButtonSize, string> = {
		sm: 'h-9 px-4 text-sm gap-1.5',
		md: 'h-12 px-6 text-base gap-2',
		lg: 'h-14 px-8 text-lg gap-2.5'
	};

	const computedClasses = $derived(
		[
			baseClasses,
			variantClasses[variant],
			sizeClasses[size],
			fullWidth ? 'w-full' : '',
			loading || disabled ? 'cursor-not-allowed' : '',
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<button class={computedClasses} disabled={disabled || loading} {...restProps}>
	{#if loading}
		<svg
			class="animate-spin -ml-1 h-4 w-4"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	{/if}
	{@render children()}
</button>
