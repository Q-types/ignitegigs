<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type RatingSize = 'sm' | 'md' | 'lg';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: number;
		max?: number;
		size?: RatingSize;
		interactive?: boolean;
		halfStars?: boolean;
		onRatingChange?: (rating: number) => void;
	}

	let {
		value = 0,
		max = 5,
		size = 'md',
		interactive = false,
		halfStars = false,
		onRatingChange,
		class: className = '',
		...restProps
	}: Props = $props();

	let hoverValue = $state<number | null>(null);

	const displayValue = $derived(hoverValue !== null ? hoverValue : value);

	const sizeClasses: Record<RatingSize, string> = {
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
		lg: 'w-6 h-6'
	};

	const gapClasses: Record<RatingSize, string> = {
		sm: 'gap-0.5',
		md: 'gap-0.5',
		lg: 'gap-1'
	};

	function getStarFill(starIndex: number): 'full' | 'half' | 'empty' {
		const starValue = starIndex + 1;
		if (displayValue >= starValue) {
			return 'full';
		} else if (halfStars && displayValue >= starValue - 0.5) {
			return 'half';
		}
		return 'empty';
	}

	function handleClick(starIndex: number, event: MouseEvent) {
		if (!interactive) return;

		let newRating = starIndex + 1;

		if (halfStars) {
			const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
			const x = event.clientX - rect.left;
			if (x < rect.width / 2) {
				newRating = starIndex + 0.5;
			}
		}

		onRatingChange?.(newRating);
	}

	function handleMouseMove(starIndex: number, event: MouseEvent) {
		if (!interactive) return;

		let newHover = starIndex + 1;

		if (halfStars) {
			const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
			const x = event.clientX - rect.left;
			if (x < rect.width / 2) {
				newHover = starIndex + 0.5;
			}
		}

		hoverValue = newHover;
	}

	function handleMouseLeave() {
		if (!interactive) return;
		hoverValue = null;
	}

	const computedClasses = $derived(
		['flex items-center text-warning', gapClasses[size], className].filter(Boolean).join(' ')
	);
</script>

<div
	class={computedClasses}
	role={interactive ? 'radiogroup' : 'img'}
	aria-label={`Rating: ${value} out of ${max} stars`}
	{...restProps}
>
	{#each Array(max) as _, i}
		{@const fill = getStarFill(i)}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<span
			class={sizeClasses[size]}
			class:cursor-pointer={interactive}
			role={interactive ? 'radio' : undefined}
			aria-checked={interactive ? value >= i + 1 : undefined}
			tabindex={interactive ? 0 : undefined}
			onclick={(e) => handleClick(i, e)}
			onmousemove={(e) => handleMouseMove(i, e)}
			onmouseleave={handleMouseLeave}
		>
			{#if fill === 'full'}
				<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
					<path
						d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
					></path>
				</svg>
			{:else if fill === 'half'}
				<svg viewBox="0 0 24 24" class="w-full h-full">
					<defs>
						<linearGradient id="half-{i}">
							<stop offset="50%" stop-color="currentColor" />
							<stop offset="50%" stop-color="transparent" />
						</linearGradient>
					</defs>
					<path
						d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
						fill="url(#half-{i})"
						stroke="currentColor"
						stroke-width="1"
					></path>
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full">
					<path
						d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
					></path>
				</svg>
			{/if}
		</span>
	{/each}
</div>
