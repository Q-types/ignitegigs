<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type BadgeVariant = 'fire' | 'led' | 'verified' | 'neutral' | 'default' | 'success' | 'warning' | 'error' | 'info';
	type BadgeSize = 'sm' | 'md' | 'lg';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		variant?: BadgeVariant;
		size?: BadgeSize;
		children: Snippet;
	}

	let {
		variant = 'neutral',
		size = 'md',
		children,
		class: className = '',
		...restProps
	}: Props = $props();

	const baseClasses = 'inline-flex items-center font-medium rounded-badge';

	const variantClasses: Record<BadgeVariant, string> = {
		fire: 'bg-orange-100 text-orange-600',
		led: 'bg-purple-100 text-purple-600',
		verified: 'bg-success/10 text-success',
		neutral: 'bg-gray-100 text-gray-600',
		default: 'bg-gray-100 text-gray-600',
		success: 'bg-success/10 text-success',
		warning: 'bg-warning/10 text-warning',
		error: 'bg-error/10 text-error',
		info: 'bg-blue-100 text-blue-600'
	};

	const sizeClasses: Record<BadgeSize, string> = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-2.5 py-1 text-xs',
		lg: 'px-3 py-1.5 text-sm'
	};

	const computedClasses = $derived(
		[baseClasses, variantClasses[variant], sizeClasses[size], className].filter(Boolean).join(' ')
	);
</script>

<span class={computedClasses} {...restProps}>
	{@render children()}
</span>
