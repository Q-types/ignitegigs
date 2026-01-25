<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type CardVariant = 'default' | 'elevated' | 'bordered';
	type CardPadding = 'none' | 'sm' | 'md' | 'lg';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: CardVariant;
		padding?: CardPadding;
		header?: Snippet;
		footer?: Snippet;
		children: Snippet;
	}

	let {
		variant = 'default',
		padding = 'md',
		header,
		footer,
		children,
		class: className = '',
		...restProps
	}: Props = $props();

	const baseClasses = 'bg-surface rounded-card overflow-hidden transition-all duration-200';

	const variantClasses: Record<CardVariant, string> = {
		default: 'shadow-card hover:shadow-card-hover',
		elevated: 'shadow-lg hover:shadow-xl',
		bordered: 'border border-gray-200 hover:border-gray-300'
	};

	const paddingClasses: Record<CardPadding, string> = {
		none: '',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8'
	};

	const computedClasses = $derived(
		[baseClasses, variantClasses[variant], className].filter(Boolean).join(' ')
	);

	const bodyPaddingClass = $derived(paddingClasses[padding]);
</script>

<div class={computedClasses} {...restProps}>
	{#if header}
		<div class="border-b border-gray-100 {bodyPaddingClass}">
			{@render header()}
		</div>
	{/if}

	<div class={bodyPaddingClass}>
		{@render children()}
	</div>

	{#if footer}
		<div class="border-t border-gray-100 {bodyPaddingClass}">
			{@render footer()}
		</div>
	{/if}
</div>
