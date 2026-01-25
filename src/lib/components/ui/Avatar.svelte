<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
	type AvatarStatus = 'online' | 'offline' | undefined;

	interface Props extends HTMLAttributes<HTMLDivElement> {
		src?: string;
		alt?: string;
		name?: string;
		size?: AvatarSize;
		status?: AvatarStatus;
	}

	let {
		src,
		alt = '',
		name = '',
		size = 'md',
		status,
		class: className = '',
		...restProps
	}: Props = $props();

	const initials = $derived(
		name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	);

	const sizeClasses: Record<AvatarSize, string> = {
		sm: 'w-8 h-8 text-xs',
		md: 'w-12 h-12 text-sm',
		lg: 'w-16 h-16 text-base',
		xl: 'w-24 h-24 text-xl'
	};

	const statusSizeClasses: Record<AvatarSize, string> = {
		sm: 'w-2 h-2',
		md: 'w-3 h-3',
		lg: 'w-4 h-4',
		xl: 'w-5 h-5'
	};

	const statusColorClasses: Record<NonNullable<AvatarStatus>, string> = {
		online: 'bg-success',
		offline: 'bg-gray-400'
	};

	const computedClasses = $derived(
		['relative inline-flex shrink-0', sizeClasses[size], className].filter(Boolean).join(' ')
	);

	let imageError = $state(false);

	function handleImageError() {
		imageError = true;
	}
</script>

<div class={computedClasses} {...restProps}>
	{#if src && !imageError}
		<img
			{src}
			{alt}
			class="w-full h-full rounded-full object-cover"
			onerror={handleImageError}
		/>
	{:else}
		<div
			class="w-full h-full rounded-full bg-primary-light text-primary font-semibold flex items-center justify-center"
		>
			{initials || '?'}
		</div>
	{/if}

	{#if status}
		<span
			class="absolute bottom-0 right-0 rounded-full ring-2 ring-white {statusSizeClasses[size]} {statusColorClasses[status]}"
		></span>
	{/if}
</div>
