<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface SelectOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props extends Omit<HTMLSelectAttributes, 'value'> {
		label?: string;
		options: SelectOption[];
		value?: string;
		placeholder?: string;
		error?: string;
		hint?: string;
	}

	let {
		label,
		options,
		value = $bindable(''),
		placeholder,
		error,
		hint,
		id,
		disabled = false,
		class: className = '',
		...restProps
	}: Props = $props();

	const selectId = $derived(id || `select-${Math.random().toString(36).substring(2, 9)}`);

	const baseSelectClasses =
		'block w-full h-12 px-4 pr-10 rounded-input border bg-white text-secondary appearance-none transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400';

	const stateClasses = $derived(
		error
			? 'border-error focus:border-error focus:ring-error/20'
			: 'border-gray-200 focus:border-primary focus:ring-primary/20'
	);

	const computedClasses = $derived(
		[baseSelectClasses, stateClasses, className].filter(Boolean).join(' ')
	);
</script>

<div class="w-full">
	{#if label}
		<label for={selectId} class="block text-sm font-medium text-secondary mb-1.5">
			{label}
		</label>
	{/if}

	<div class="relative">
		<select
			id={selectId}
			class={computedClasses}
			{disabled}
			aria-invalid={!!error}
			bind:value
			{...restProps}
		>
			{#if placeholder}
				<option value="" disabled>{placeholder}</option>
			{/if}
			{#each options as option}
				<option value={option.value} disabled={option.disabled}>
					{option.label}
				</option>
			{/each}
		</select>

		<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
				></path>
			</svg>
		</div>
	</div>

	{#if error}
		<p class="mt-1.5 text-sm text-error">{error}</p>
	{:else if hint}
		<p class="mt-1.5 text-sm text-gray-500">{hint}</p>
	{/if}
</div>
