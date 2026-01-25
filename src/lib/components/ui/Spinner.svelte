<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type SpinnerSize = 'sm' | 'md' | 'lg';
	type SpinnerVariant = 'primary' | 'secondary' | 'white' | 'current';

	interface Props extends HTMLAttributes<SVGSVGElement> {
		size?: SpinnerSize;
		variant?: SpinnerVariant;
	}

	let {
		size = 'md',
		variant = 'primary',
		class: className = '',
		...restProps
	}: Props = $props();

	const sizeClasses: Record<SpinnerSize, string> = {
		sm: 'w-4 h-4',
		md: 'w-6 h-6',
		lg: 'w-8 h-8'
	};

	const variantClasses: Record<SpinnerVariant, string> = {
		primary: 'text-primary',
		secondary: 'text-secondary',
		white: 'text-white',
		current: 'text-current'
	};

	const computedClasses = $derived(
		['animate-spin', sizeClasses[size], variantClasses[variant], className]
			.filter(Boolean)
			.join(' ')
	);
</script>

<svg
	class={computedClasses}
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	role="status"
	aria-label="Loading"
	{...restProps}
>
	<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
	<path
		class="opacity-75"
		fill="currentColor"
		d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
	></path>
</svg>
