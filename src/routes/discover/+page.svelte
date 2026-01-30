<script lang="ts">
	import SEO from '$components/SEO.svelte';

	// Quiz state
	let currentStep = $state(0);
	let answers = $state<Record<string, string>>({});
	let direction = $state<'forward' | 'back'>('forward');
	let isTransitioning = $state(false);

	// Step definitions
	const steps = [
		{
			id: 'occasion',
			title: "What's the occasion?",
			subtitle: 'Pick the event type that best describes yours',
			options: [
				{ value: 'wedding', label: 'Wedding', emoji: '💒', desc: 'Ceremony, reception or evening do' },
				{ value: 'corporate', label: 'Corporate Event', emoji: '🏢', desc: 'Conference, awards or team party' },
				{ value: 'birthday', label: 'Birthday Party', emoji: '🎂', desc: 'Milestone celebration or surprise' },
				{ value: 'festival', label: 'Festival / Fair', emoji: '🎪', desc: 'Outdoor festival or community fair' },
				{ value: 'private', label: 'Private Party', emoji: '🥂', desc: 'House party or private gathering' },
				{ value: 'bar_club', label: 'Bar / Club Night', emoji: '🎵', desc: 'Venue night or club event' },
				{ value: 'charity', label: 'Charity Event', emoji: '❤️', desc: 'Fundraiser or charity gala' },
				{ value: 'other', label: 'Something Else', emoji: '✨', desc: 'Surprise us with your event' }
			]
		},
		{
			id: 'vibe',
			title: "What's the vibe?",
			subtitle: 'How do you want your guests to feel?',
			options: [
				{
					value: 'elegant',
					label: 'Elegant & Sophisticated',
					emoji: '🕯️',
					desc: 'Ambient, background entertainment',
					gradient: 'from-amber-100 via-yellow-50 to-orange-50',
					border: 'border-amber-200 hover:border-amber-400',
					glow: 'hover:shadow-amber-200/50'
				},
				{
					value: 'fun',
					label: 'Fun & Lively',
					emoji: '🎉',
					desc: 'Interactive, engaging performances',
					gradient: 'from-pink-100 via-rose-50 to-orange-50',
					border: 'border-pink-200 hover:border-pink-400',
					glow: 'hover:shadow-pink-200/50'
				},
				{
					value: 'wild',
					label: 'High Energy & Wild',
					emoji: '🔥',
					desc: 'Wow-factor, showstopping acts',
					gradient: 'from-red-100 via-orange-50 to-yellow-50',
					border: 'border-red-200 hover:border-red-400',
					glow: 'hover:shadow-red-200/50'
				},
				{
					value: 'mysterious',
					label: 'Mysterious & Enchanting',
					emoji: '🌙',
					desc: 'Atmospheric, magical moments',
					gradient: 'from-purple-100 via-indigo-50 to-blue-50',
					border: 'border-purple-200 hover:border-purple-400',
					glow: 'hover:shadow-purple-200/50'
				}
			]
		},
		{
			id: 'venue',
			title: "Where's it happening?",
			subtitle: 'This helps us match the right style of act',
			options: [
				{ value: 'indoor', label: 'Indoor Venue', emoji: '🏛️', desc: 'Hotel, hall or function room' },
				{ value: 'outdoor', label: 'Outdoor / Garden', emoji: '🌳', desc: 'Open-air space or garden party' },
				{ value: 'marquee', label: 'Marquee / Tent', emoji: '⛺', desc: 'Covered outdoor with some space' },
				{ value: 'stage', label: 'Stage / Theatre', emoji: '🎭', desc: 'Dedicated performance space' },
				{ value: 'roaming', label: 'Roaming / Walkabout', emoji: '🚶', desc: 'Performers move through crowd' },
				{ value: 'multiple', label: 'Multiple Areas', emoji: '📍', desc: 'Several spaces across a venue' }
			]
		},
		{
			id: 'guestCount',
			title: 'How many guests?',
			subtitle: 'Helps us recommend solo artists or troupes',
			options: [
				{
					value: 'intimate',
					label: 'Intimate',
					emoji: '👥',
					desc: '1 - 30 guests',
					size: 'Small, personal gathering'
				},
				{
					value: 'medium',
					label: 'Medium',
					emoji: '👨‍👩‍👧‍👦',
					desc: '30 - 100 guests',
					size: 'A great-sized party'
				},
				{
					value: 'large',
					label: 'Large',
					emoji: '🏟️',
					desc: '100 - 300 guests',
					size: 'Big event energy'
				},
				{
					value: 'festival',
					label: 'Festival',
					emoji: '🎆',
					desc: '300+ guests',
					size: 'Massive crowd scale'
				}
			]
		},
		{
			id: 'budget',
			title: "What's your budget?",
			subtitle: "No wrong answers -- we'll find the best match",
			options: [
				{ value: 'under200', label: 'Under \u00A3200', emoji: '💷', desc: 'Great for shorter sets' },
				{ value: '200to500', label: '\u00A3200 - \u00A3500', emoji: '💷💷', desc: 'Most popular range' },
				{ value: '500to1000', label: '\u00A3500 - \u00A31,000', emoji: '💷💷💷', desc: 'Premium performances' },
				{ value: '1000to2000', label: '\u00A31,000 - \u00A32,000', emoji: '🌟', desc: 'Show-stopping acts' },
				{ value: 'over2000', label: '\u00A32,000+', emoji: '👑', desc: 'The full spectacular' }
			]
		}
	];

	let currentStepData = $derived(steps[currentStep]);
	let progress = $derived(((currentStep + 1) / steps.length) * 100);
	let canGoBack = $derived(currentStep > 0);
	let isComplete = $derived(currentStep >= steps.length);

	function selectOption(stepId: string, value: string) {
		if (isTransitioning) return;
		answers[stepId] = value;
		direction = 'forward';
		isTransitioning = true;

		// Auto-advance after a brief delay for visual feedback
		setTimeout(() => {
			if (currentStep < steps.length - 1) {
				currentStep++;
			} else {
				// Quiz complete - navigate to results
				navigateToResults();
			}
			isTransitioning = false;
		}, 350);
	}

	function goBack() {
		if (currentStep > 0 && !isTransitioning) {
			direction = 'back';
			isTransitioning = true;
			setTimeout(() => {
				currentStep--;
				isTransitioning = false;
			}, 200);
		}
	}

	function navigateToResults() {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(answers)) {
			params.set(key, value);
		}
		window.location.href = `/discover/results?${params.toString()}`;
	}

	function restartQuiz() {
		answers = {};
		currentStep = 0;
		direction = 'forward';
	}
</script>

<SEO
	title="Event Vibe Quiz - Find Your Perfect Performer"
	description="Take our 60-second quiz to discover the ideal performer for your event. Matched to your occasion, vibe, venue and budget."
/>

<div class="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-secondary via-[#1a1a2e] to-[#16162a] flex flex-col">
	<!-- Progress Bar -->
	<div class="w-full bg-secondary-light/30">
		<div
			class="h-1 bg-gradient-to-r from-primary via-orange-400 to-yellow-400 transition-all duration-500 ease-out"
			style="width: {progress}%"
		></div>
	</div>

	<!-- Header Area -->
	<div class="text-center pt-6 pb-2 px-4">
		<!-- Step counter & back button -->
		<div class="flex items-center justify-between max-w-2xl mx-auto mb-4">
			<button
				onclick={goBack}
				class="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-0 disabled:pointer-events-none"
				disabled={!canGoBack}
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Back
			</button>

			<!-- Progress dots -->
			<div class="flex items-center gap-2">
				{#each steps as step, i}
					<button
						onclick={() => {
							if (i < currentStep) {
								direction = 'back';
								currentStep = i;
							}
						}}
						class="w-2.5 h-2.5 rounded-full transition-all duration-300 {i === currentStep
							? 'bg-primary scale-125 shadow-lg shadow-primary/40'
							: i < currentStep
								? 'bg-primary/60 cursor-pointer hover:bg-primary/80'
								: 'bg-gray-600'}"
						aria-label="Step {i + 1}: {step.title}"
						disabled={i > currentStep}
					></button>
				{/each}
			</div>

			<span class="text-sm text-gray-500">
				{currentStep + 1}/{steps.length}
			</span>
		</div>
	</div>

	<!-- Quiz Content -->
	<div class="flex-1 flex flex-col items-center justify-center px-4 pb-8">
		{#key currentStep}
			<div
				class="w-full max-w-3xl animate-fade-in"
			>
				<!-- Question -->
				<div class="text-center mb-8">
					<h1 class="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
						{currentStepData.title}
					</h1>
					<p class="text-gray-400 text-lg">
						{currentStepData.subtitle}
					</p>
				</div>

				<!-- Options Grid -->
				{#if currentStepData.id === 'vibe'}
					<!-- Vibe step: 2x2 with gradient cards -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
						{#each currentStepData.options as option}
							{@const isSelected = answers[currentStepData.id] === option.value}
							<button
								onclick={() => selectOption(currentStepData.id, option.value)}
								class="group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl
									{isSelected
										? 'border-primary bg-gradient-to-br ' + (option.gradient || '') + ' shadow-lg scale-[1.02]'
										: (option.border || 'border-gray-700 hover:border-gray-500') + ' bg-gradient-to-br ' + (option.gradient || 'from-gray-800 to-gray-900')
									}
									{option.glow || ''}"
							>
								<!-- Selection indicator -->
								{#if isSelected}
									<div class="absolute top-3 right-3">
										<div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
											<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
											</svg>
										</div>
									</div>
								{/if}

								<span class="text-3xl mb-3 block">{option.emoji}</span>
								<h3 class="font-display font-bold text-lg mb-1 {isSelected ? 'text-secondary' : 'text-gray-800'}">
									{option.label}
								</h3>
								<p class="text-sm {isSelected ? 'text-gray-600' : 'text-gray-500'}">
									{option.desc}
								</p>
							</button>
						{/each}
					</div>

				{:else if currentStepData.id === 'guestCount'}
					<!-- Guest count: visual size cards -->
					<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
						{#each currentStepData.options as option}
							{@const isSelected = answers[currentStepData.id] === option.value}
							<button
								onclick={() => selectOption(currentStepData.id, option.value)}
								class="group relative rounded-2xl border-2 p-5 text-center transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl
									{isSelected
										? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-[1.03]'
										: 'border-gray-700 hover:border-gray-500 bg-white/5 hover:bg-white/10'}"
							>
								{#if isSelected}
									<div class="absolute top-2 right-2">
										<div class="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
											<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
											</svg>
										</div>
									</div>
								{/if}

								<span class="text-3xl mb-2 block">{option.emoji}</span>
								<h3 class="font-display font-bold text-white mb-1">{option.label}</h3>
								<p class="text-sm text-primary font-semibold">{option.desc}</p>
								<p class="text-xs text-gray-500 mt-1">{option.size}</p>
							</button>
						{/each}
					</div>

				{:else if currentStepData.id === 'occasion'}
					<!-- Occasion: 2x4 grid -->
					<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
						{#each currentStepData.options as option}
							{@const isSelected = answers[currentStepData.id] === option.value}
							<button
								onclick={() => selectOption(currentStepData.id, option.value)}
								class="group relative rounded-2xl border-2 p-4 sm:p-5 text-center transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl
									{isSelected
										? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-[1.03]'
										: 'border-gray-700 hover:border-gray-500 bg-white/5 hover:bg-white/10'}"
							>
								{#if isSelected}
									<div class="absolute top-2 right-2">
										<div class="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
											<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
											</svg>
										</div>
									</div>
								{/if}

								<span class="text-2xl sm:text-3xl mb-2 block">{option.emoji}</span>
								<h3 class="font-display font-bold text-sm sm:text-base text-white mb-0.5">{option.label}</h3>
								<p class="text-xs text-gray-400 hidden sm:block">{option.desc}</p>
							</button>
						{/each}
					</div>

				{:else if currentStepData.id === 'budget'}
					<!-- Budget: stacked cards with emphasis -->
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
						{#each currentStepData.options as option, i}
							{@const isSelected = answers[currentStepData.id] === option.value}
							{@const isPopular = i === 1}
							<button
								onclick={() => selectOption(currentStepData.id, option.value)}
								class="group relative rounded-2xl border-2 p-5 text-center transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl
									{isSelected
										? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-[1.03]'
										: isPopular
											? 'border-primary/40 bg-primary/5 hover:border-primary/70'
											: 'border-gray-700 hover:border-gray-500 bg-white/5 hover:bg-white/10'}"
							>
								{#if isPopular && !isSelected}
									<div class="absolute -top-2.5 left-1/2 -translate-x-1/2">
										<span class="text-[10px] font-bold uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-full">
											Most Popular
										</span>
									</div>
								{/if}

								{#if isSelected}
									<div class="absolute top-2 right-2">
										<div class="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
											<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
											</svg>
										</div>
									</div>
								{/if}

								<span class="text-2xl mb-2 block">{option.emoji}</span>
								<h3 class="font-display font-bold text-lg text-white mb-1">{option.label}</h3>
								<p class="text-sm text-gray-400">{option.desc}</p>
							</button>
						{/each}
					</div>

				{:else}
					<!-- Default grid: 2x3 for venue -->
					<div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
						{#each currentStepData.options as option}
							{@const isSelected = answers[currentStepData.id] === option.value}
							<button
								onclick={() => selectOption(currentStepData.id, option.value)}
								class="group relative rounded-2xl border-2 p-5 text-center transition-all duration-300 transform hover:scale-[1.03] hover:shadow-xl
									{isSelected
										? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-[1.03]'
										: 'border-gray-700 hover:border-gray-500 bg-white/5 hover:bg-white/10'}"
							>
								{#if isSelected}
									<div class="absolute top-2 right-2">
										<div class="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
											<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
											</svg>
										</div>
									</div>
								{/if}

								<span class="text-3xl mb-2 block">{option.emoji}</span>
								<h3 class="font-display font-bold text-white mb-0.5">{option.label}</h3>
								<p class="text-xs text-gray-400">{option.desc}</p>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/key}
	</div>

	<!-- Bottom area: skip / restart -->
	<div class="text-center pb-6 px-4">
		<p class="text-gray-600 text-sm">
			Already know what you want?
			<a href="/performers" class="text-primary hover:text-primary/80 transition-colors font-medium">
				Browse all performers
			</a>
		</p>
	</div>
</div>

<style>
	@keyframes slideInRight {
		from {
			opacity: 0;
			transform: translateX(30px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes slideInLeft {
		from {
			opacity: 0;
			transform: translateX(-30px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
