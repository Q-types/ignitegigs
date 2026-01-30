<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'default',
		size = 'md',
		children
	}: {
		variant: 'default' | 'success' | 'warning' | 'error' | 'info';
		size: 'sm' | 'md';
		children: Snippet;
	} = $props();

	const variantClasses: Record<string, string> = {
		default: 'bg-gray-100 text-gray-700',
		success: 'bg-green-100 text-green-700',
		warning: 'bg-yellow-100 text-yellow-700',
		error: 'bg-red-100 text-red-700',
		info: 'bg-blue-100 text-blue-700'
	};

	const sizeClasses: Record<string, string> = {
		sm: 'px-1.5 py-0.5 text-[10px]',
		md: 'px-2 py-0.5 text-xs'
	};
</script>

<span
	class="inline-flex items-center font-medium rounded-full capitalize {variantClasses[variant]} {sizeClasses[size]}"
>
	{@render children()}
</span>
