<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	type InputType = 'text' | 'email' | 'password' | 'date' | 'number';

	interface Props extends Omit<HTMLInputAttributes, 'type'> {
		type?: InputType;
		label?: string;
		error?: string;
		hint?: string;
		leadingIcon?: Snippet;
		trailingIcon?: Snippet;
	}

	let {
		type = 'text',
		label,
		error,
		hint,
		leadingIcon,
		trailingIcon,
		id,
		disabled = false,
		class: className = '',
		...restProps
	}: Props = $props();

	const inputId = $derived(id || `input-${Math.random().toString(36).substring(2, 9)}`);

	const baseInputClasses =
		'block w-full h-12 rounded-input border bg-white text-secondary transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400';

	const stateClasses = $derived(
		error
			? 'border-error focus:border-error focus:ring-error/20'
			: 'border-gray-200 focus:border-primary focus:ring-primary/20'
	);

	const paddingClasses = $derived(
		[leadingIcon ? 'pl-11' : 'pl-4', trailingIcon ? 'pr-11' : 'pr-4'].join(' ')
	);

	const computedClasses = $derived(
		[baseInputClasses, stateClasses, paddingClasses, className].filter(Boolean).join(' ')
	);
</script>

<div class="w-full">
	{#if label}
		<label for={inputId} class="block text-sm font-medium text-secondary mb-1.5">
			{label}
		</label>
	{/if}

	<div class="relative">
		{#if leadingIcon}
			<div
				class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"
			>
				{@render leadingIcon()}
			</div>
		{/if}

		<input {type} id={inputId} class={computedClasses} {disabled} aria-invalid={!!error} {...restProps} />

		{#if trailingIcon}
			<div
				class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"
			>
				{@render trailingIcon()}
			</div>
		{/if}
	</div>

	{#if error}
		<p class="mt-1.5 text-sm text-error">{error}</p>
	{:else if hint}
		<p class="mt-1.5 text-sm text-gray-500">{hint}</p>
	{/if}
</div>
