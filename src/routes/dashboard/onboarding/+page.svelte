<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { data, form }: { data: typeof import('./$types').PageData; form: ActionData } = $props();

	const profile = data.profile;
	const TOTAL_STEPS = 5;

	// Current wizard step
	let currentStep = $state(1);

	// Step 1: About You
	let stageName = $state(profile?.stage_name ?? '');
	let bio = $state(profile?.bio ?? '');
	let tagline = $state(profile?.tagline ?? '');

	// Step 2: What You Do
	let selectedCategories = $state<string[]>(profile?.performer_category ?? []);
	let selectedActTypes = $state<string[]>(profile?.act_types ?? []);

	// Step 3: Location
	let locationName = $state(profile?.location_name ?? '');
	let travelRadius = $state(profile?.travel_radius_miles ?? 25);

	// Step 4: Rates
	let hourlyRate = $state(profile?.hourly_rate_pence ? (profile.hourly_rate_pence / 100).toString() : '');
	let eventRate = $state(profile?.event_rate_pence ? (profile.event_rate_pence / 100).toString() : '');
	let showRate = $state(profile?.show_rate_pence ? (profile.show_rate_pence / 100).toString() : '');
	let minRate = $state(profile?.min_rate_pence ? (profile.min_rate_pence / 100).toString() : '');

	// UI state
	let isSubmitting = $state(false);
	let stepError = $state('');

	// Categories list
	const categories = [
		{ value: 'fire', label: 'Fire Performance' },
		{ value: 'led', label: 'LED/Glow' },
		{ value: 'circus', label: 'Circus Arts' },
		{ value: 'stilt', label: 'Stilt Walking' },
		{ value: 'juggling', label: 'Juggling' },
		{ value: 'magic', label: 'Magic & Illusion' },
		{ value: 'balloon', label: 'Balloon Art' },
		{ value: 'face_painting', label: 'Face Painting' },
		{ value: 'caricature', label: 'Caricature' },
		{ value: 'living_statue', label: 'Living Statue' },
		{ value: 'dj_music', label: 'DJ / Music' },
		{ value: 'comedy', label: 'Comedy' },
		{ value: 'variety', label: 'Variety / Other' }
	];

	// Act types list
	const actTypes = [
		{ value: 'solo', label: 'Solo Act' },
		{ value: 'duo', label: 'Duo' },
		{ value: 'group', label: 'Group/Troupe' },
		{ value: 'walkabout', label: 'Walkabout' },
		{ value: 'stage_show', label: 'Stage Show' },
		{ value: 'workshop', label: 'Workshop' },
		{ value: 'interactive', label: 'Interactive' },
		{ value: 'ambient', label: 'Ambient' }
	];

	// Derived validations
	let bioLength = $derived(bio.length);
	let bioValid = $derived(bioLength >= 50);

	let step1Valid = $derived(stageName.trim().length > 0 && bioValid);
	let step2Valid = $derived(selectedCategories.length > 0);
	let step3Valid = $derived(locationName.trim().length > 0);

	// Checklist items for Step 5
	let checkAbout = $derived(stageName.trim().length > 0 && bioValid);
	let checkSkills = $derived(selectedCategories.length > 0);
	let checkLocation = $derived(locationName.trim().length > 0);
	let checkRates = $derived(
		hourlyRate !== '' || eventRate !== '' || showRate !== '' || minRate !== ''
	);

	// Step titles
	const stepTitles = [
		'Tell us about you',
		'What do you do?',
		'Where are you based?',
		'Set your rates',
		'Almost there!'
	];

	function toggleCategory(value: string) {
		if (selectedCategories.includes(value)) {
			selectedCategories = selectedCategories.filter((c) => c !== value);
		} else {
			selectedCategories = [...selectedCategories, value];
		}
	}

	function toggleActType(value: string) {
		if (selectedActTypes.includes(value)) {
			selectedActTypes = selectedActTypes.filter((a) => a !== value);
		} else {
			selectedActTypes = [...selectedActTypes, value];
		}
	}

	function goNext() {
		stepError = '';

		// Validate current step before advancing
		if (currentStep === 1 && !step1Valid) {
			if (!stageName.trim()) {
				stepError = 'Please enter your stage name.';
			} else if (!bioValid) {
				stepError = `Bio must be at least 50 characters (currently ${bioLength}).`;
			}
			return;
		}

		if (currentStep === 2 && !step2Valid) {
			stepError = 'Please select at least one category.';
			return;
		}

		if (currentStep === 3 && !step3Valid) {
			stepError = 'Please enter your location.';
			return;
		}

		if (currentStep < TOTAL_STEPS) {
			currentStep += 1;
			// Scroll to top on step change
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function goPrev() {
		stepError = '';
		if (currentStep > 1) {
			currentStep -= 1;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function goToStep(step: number) {
		stepError = '';
		currentStep = step;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>Performer Onboarding - IgniteGigs</title>
</svelte:head>

<div class="max-w-2xl mx-auto">
	<!-- Header -->
	<div class="text-center mb-8">
		<h1 class="font-display text-2xl sm:text-3xl font-bold text-secondary">
			Set Up Your Performer Profile
		</h1>
		<p class="text-gray-500 mt-2">Complete these steps to start getting bookings on IgniteGigs</p>
	</div>

	<!-- Progress Bar -->
	<div class="mb-8">
		<div class="flex items-center justify-between mb-3">
			<span class="text-sm font-medium text-gray-600">
				Step {currentStep} of {TOTAL_STEPS}
			</span>
			<span class="text-sm font-medium text-primary">
				{stepTitles[currentStep - 1]}
			</span>
		</div>
		<div class="flex items-center gap-2">
			{#each Array(TOTAL_STEPS) as _, i}
				<button
					type="button"
					onclick={() => goToStep(i + 1)}
					class="flex-1 h-2 rounded-full transition-all duration-300 {i + 1 <= currentStep
						? 'bg-primary'
						: 'bg-gray-200'}"
					aria-label="Go to step {i + 1}"
				></button>
			{/each}
		</div>
		<!-- Step dots -->
		<div class="flex items-center justify-between mt-2 px-1">
			{#each Array(TOTAL_STEPS) as _, i}
				<button
					type="button"
					onclick={() => goToStep(i + 1)}
					class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 {i + 1 === currentStep
						? 'bg-primary text-white shadow-lg scale-110'
						: i + 1 < currentStep
							? 'bg-primary/20 text-primary'
							: 'bg-gray-100 text-gray-400'}"
				>
					{#if i + 1 < currentStep}
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
						</svg>
					{:else}
						{i + 1}
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- Error display -->
	{#if stepError}
		<div class="mb-6 p-4 bg-error/10 text-error rounded-lg flex items-center gap-3 animate-fade-in">
			<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span class="text-sm">{stepError}</span>
		</div>
	{/if}

	{#if form?.error}
		<div class="mb-6 p-4 bg-error/10 text-error rounded-lg flex items-center gap-3 animate-fade-in">
			<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span class="text-sm">{form.error}</span>
		</div>
	{/if}

	<!-- Wizard Form -->
	<form
		method="POST"
		action="?/saveOnboarding"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update, result }) => {
				isSubmitting = false;
				if (result.type === 'failure') {
					await update();
				}
				// redirect is handled automatically by SvelteKit
			};
		}}
	>
		<!-- Hidden fields to persist all data across steps -->
		<input type="hidden" name="stageName" value={stageName} />
		<input type="hidden" name="bio" value={bio} />
		<input type="hidden" name="tagline" value={tagline} />
		{#each selectedCategories as cat}
			<input type="hidden" name="categories" value={cat} />
		{/each}
		{#each selectedActTypes as act}
			<input type="hidden" name="actTypes" value={act} />
		{/each}
		<input type="hidden" name="locationName" value={locationName} />
		<input type="hidden" name="travelRadius" value={travelRadius} />
		<input type="hidden" name="hourlyRate" value={hourlyRate} />
		<input type="hidden" name="eventRate" value={eventRate} />
		<input type="hidden" name="showRate" value={showRate} />
		<input type="hidden" name="minRate" value={minRate} />

		<!-- STEP 1: Tell us about you -->
		{#if currentStep === 1}
			<div class="bg-white rounded-card shadow-card p-6 sm:p-8 animate-fade-in">
				<div class="flex items-center gap-3 mb-6">
					<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
						<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</div>
					<div>
						<h2 class="font-display text-lg font-semibold text-secondary">Tell us about you</h2>
						<p class="text-sm text-gray-500">Let clients know who they're booking</p>
					</div>
				</div>

				<div class="space-y-5">
					<div>
						<label for="stageName" class="label">
							Stage Name <span class="text-error">*</span>
						</label>
						<input
							id="stageName"
							type="text"
							bind:value={stageName}
							class="input"
							placeholder="Your performer name"
							required
						/>
					</div>

					<div>
						<label for="bio" class="label">
							Bio <span class="text-error">*</span>
						</label>
						<textarea
							id="bio"
							rows="5"
							bind:value={bio}
							class="input min-h-[120px] py-3"
							placeholder="Tell clients about yourself, your experience, and what makes your performance special..."
						></textarea>
						<div class="flex items-center justify-between mt-1.5">
							<p class="text-xs {bioLength >= 50 ? 'text-success' : bioLength >= 30 ? 'text-warning' : 'text-gray-400'}">
								{bioLength >= 50 ? 'Looks great!' : `${50 - bioLength} more characters needed`}
							</p>
							<p class="text-xs {bioLength >= 50 ? 'text-success' : 'text-gray-400'}">
								{bioLength}/50 min
							</p>
						</div>
					</div>

					<div>
						<label for="tagline" class="label">Tagline</label>
						<input
							id="tagline"
							type="text"
							bind:value={tagline}
							class="input"
							placeholder="A short catchy description (e.g., 'Mesmerizing fire artistry for unforgettable events')"
							maxlength="100"
						/>
						<p class="text-xs text-gray-400 mt-1">{tagline.length}/100 characters</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- STEP 2: What do you do? -->
		{#if currentStep === 2}
			<div class="bg-white rounded-card shadow-card p-6 sm:p-8 animate-fade-in">
				<div class="flex items-center gap-3 mb-6">
					<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
						<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
						</svg>
					</div>
					<div>
						<h2 class="font-display text-lg font-semibold text-secondary">What do you do?</h2>
						<p class="text-sm text-gray-500">Help clients find you by selecting your skills</p>
					</div>
				</div>

				<!-- Categories -->
				<div class="mb-8">
					<h3 class="text-sm font-semibold text-gray-700 mb-1">
						Performance Categories <span class="text-error">*</span>
					</h3>
					<p class="text-xs text-gray-500 mb-3">Select all that apply</p>

					<div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
						{#each categories as cat}
							<button
								type="button"
								class="p-3 rounded-lg border-2 text-left transition-all text-sm {selectedCategories.includes(cat.value)
									? 'border-primary bg-primary/5 text-primary font-medium'
									: 'border-gray-200 hover:border-gray-300 text-gray-700'}"
								onclick={() => toggleCategory(cat.value)}
							>
								<span class="flex items-center gap-2">
									{#if selectedCategories.includes(cat.value)}
										<svg class="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
										</svg>
									{:else}
										<span class="w-4 h-4 rounded border border-gray-300 flex-shrink-0"></span>
									{/if}
									{cat.label}
								</span>
							</button>
						{/each}
					</div>

					{#if selectedCategories.length > 0}
						<p class="text-xs text-success mt-2">
							{selectedCategories.length} selected
						</p>
					{/if}
				</div>

				<!-- Act Types -->
				<div>
					<h3 class="text-sm font-semibold text-gray-700 mb-1">Act Types</h3>
					<p class="text-xs text-gray-500 mb-3">What kind of performances do you offer?</p>

					<div class="flex flex-wrap gap-2">
						{#each actTypes as act}
							<button
								type="button"
								class="px-4 py-2 rounded-full text-sm font-medium transition-all {selectedActTypes.includes(act.value)
									? 'bg-primary text-white shadow-sm'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
								onclick={() => toggleActType(act.value)}
							>
								{act.label}
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- STEP 3: Where are you based? -->
		{#if currentStep === 3}
			<div class="bg-white rounded-card shadow-card p-6 sm:p-8 animate-fade-in">
				<div class="flex items-center gap-3 mb-6">
					<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
						<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
					</div>
					<div>
						<h2 class="font-display text-lg font-semibold text-secondary">Where are you based?</h2>
						<p class="text-sm text-gray-500">Clients search for performers near their event</p>
					</div>
				</div>

				<div class="space-y-6">
					<div>
						<label for="locationName" class="label">
							City / Town <span class="text-error">*</span>
						</label>
						<input
							id="locationName"
							type="text"
							bind:value={locationName}
							class="input"
							placeholder="e.g. Manchester, London, Bristol"
							required
						/>
					</div>

					<div>
						<label for="travelRadius" class="label">
							Travel Radius: <span class="font-bold text-primary">{travelRadius} miles</span>
						</label>
						<input
							id="travelRadius"
							type="range"
							min="5"
							max="200"
							step="5"
							bind:value={travelRadius}
							class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
						/>
						<div class="flex justify-between text-xs text-gray-400 mt-1">
							<span>5 mi</span>
							<span>50 mi</span>
							<span>100 mi</span>
							<span>200 mi</span>
						</div>
						<p class="text-xs text-gray-500 mt-3">
							{#if travelRadius <= 25}
								Local gigs only - great for regular local work
							{:else if travelRadius <= 75}
								Regional reach - good balance of local and wider bookings
							{:else if travelRadius <= 150}
								Wide coverage - you'll appear in searches across a large area
							{:else}
								Nationwide - willing to travel for the right booking
							{/if}
						</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- STEP 4: Set your rates -->
		{#if currentStep === 4}
			<div class="bg-white rounded-card shadow-card p-6 sm:p-8 animate-fade-in">
				<div class="flex items-center gap-3 mb-6">
					<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
						<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<h2 class="font-display text-lg font-semibold text-secondary">Set your rates</h2>
						<p class="text-sm text-gray-500">You can always provide custom quotes per event</p>
					</div>
				</div>

				<div class="grid sm:grid-cols-2 gap-4 mb-6">
					<div>
						<label for="hourlyRate" class="label">Hourly Rate</label>
						<div class="relative">
							<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">&pound;</span>
							<input
								id="hourlyRate"
								type="number"
								min="0"
								step="5"
								bind:value={hourlyRate}
								class="input pl-8"
								placeholder="150"
							/>
						</div>
					</div>

					<div>
						<label for="eventRate" class="label">Event Rate</label>
						<div class="relative">
							<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">&pound;</span>
							<input
								id="eventRate"
								type="number"
								min="0"
								step="25"
								bind:value={eventRate}
								class="input pl-8"
								placeholder="500"
							/>
						</div>
					</div>

					<div>
						<label for="showRate" class="label">Show Rate</label>
						<div class="relative">
							<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">&pound;</span>
							<input
								id="showRate"
								type="number"
								min="0"
								step="25"
								bind:value={showRate}
								class="input pl-8"
								placeholder="350"
							/>
						</div>
					</div>

					<div>
						<label for="minRate" class="label">Minimum Booking</label>
						<div class="relative">
							<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">&pound;</span>
							<input
								id="minRate"
								type="number"
								min="0"
								step="25"
								bind:value={minRate}
								class="input pl-8"
								placeholder="200"
							/>
						</div>
					</div>
				</div>

				<!-- Tip box -->
				<div class="p-4 bg-success/5 border border-success/20 rounded-lg flex items-start gap-3">
					<svg class="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<div>
						<p class="text-sm font-medium text-success">You keep 92% of every booking</p>
						<p class="text-xs text-gray-600 mt-1">
							IgniteGigs only takes a small 8% platform fee. No hidden charges, no monthly subscriptions.
						</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- STEP 5: Almost there -->
		{#if currentStep === 5}
			<div class="bg-white rounded-card shadow-card p-6 sm:p-8 animate-fade-in">
				<div class="flex items-center gap-3 mb-6">
					<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
						<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<h2 class="font-display text-lg font-semibold text-secondary">Almost there!</h2>
						<p class="text-sm text-gray-500">Review your progress and finish setting up</p>
					</div>
				</div>

				<!-- Checklist -->
				<div class="space-y-3 mb-8">
					<button
						type="button"
						onclick={() => goToStep(1)}
						class="w-full flex items-center gap-3 p-4 rounded-lg border transition-colors {checkAbout
							? 'border-success/30 bg-success/5'
							: 'border-gray-200 bg-gray-50'} hover:bg-gray-100"
					>
						{#if checkAbout}
							<div class="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0">
								<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
								</svg>
							</div>
						{:else}
							<div class="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
						{/if}
						<div class="text-left">
							<p class="text-sm font-medium {checkAbout ? 'text-success' : 'text-gray-700'}">About You</p>
							<p class="text-xs text-gray-500">Stage name, bio, and tagline</p>
						</div>
						<svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>

					<button
						type="button"
						onclick={() => goToStep(2)}
						class="w-full flex items-center gap-3 p-4 rounded-lg border transition-colors {checkSkills
							? 'border-success/30 bg-success/5'
							: 'border-gray-200 bg-gray-50'} hover:bg-gray-100"
					>
						{#if checkSkills}
							<div class="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0">
								<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
								</svg>
							</div>
						{:else}
							<div class="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
						{/if}
						<div class="text-left">
							<p class="text-sm font-medium {checkSkills ? 'text-success' : 'text-gray-700'}">Skills & Categories</p>
							<p class="text-xs text-gray-500">{selectedCategories.length} categories, {selectedActTypes.length} act types</p>
						</div>
						<svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>

					<button
						type="button"
						onclick={() => goToStep(3)}
						class="w-full flex items-center gap-3 p-4 rounded-lg border transition-colors {checkLocation
							? 'border-success/30 bg-success/5'
							: 'border-gray-200 bg-gray-50'} hover:bg-gray-100"
					>
						{#if checkLocation}
							<div class="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0">
								<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
								</svg>
							</div>
						{:else}
							<div class="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
						{/if}
						<div class="text-left">
							<p class="text-sm font-medium {checkLocation ? 'text-success' : 'text-gray-700'}">Location</p>
							<p class="text-xs text-gray-500">
								{locationName || 'Not set'}{locationName ? `, ${travelRadius} mile radius` : ''}
							</p>
						</div>
						<svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>

					<button
						type="button"
						onclick={() => goToStep(4)}
						class="w-full flex items-center gap-3 p-4 rounded-lg border transition-colors {checkRates
							? 'border-success/30 bg-success/5'
							: 'border-gray-200 bg-gray-50'} hover:bg-gray-100"
					>
						{#if checkRates}
							<div class="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0">
								<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
								</svg>
							</div>
						{:else}
							<div class="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
						{/if}
						<div class="text-left">
							<p class="text-sm font-medium {checkRates ? 'text-success' : 'text-gray-700'}">Rates</p>
							<p class="text-xs text-gray-500">
								{checkRates ? 'Rates configured' : 'No rates set yet'}
							</p>
						</div>
						<svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>

				<!-- Extra steps links -->
				<div class="border-t border-gray-100 pt-6 space-y-3">
					<p class="text-sm font-medium text-gray-700 mb-3">Optional next steps (can be done later):</p>

					<a
						href="/dashboard/media"
						class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
					>
						<div class="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors">
							<svg class="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">Upload photos & videos</p>
							<p class="text-xs text-gray-500">Showcase your best work</p>
						</div>
						<svg class="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</a>

					<a
						href="/dashboard/payments"
						class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
					>
						<div class="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors">
							<svg class="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
							</svg>
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">Set up payments</p>
							<p class="text-xs text-gray-500">Connect Stripe to receive bookings</p>
						</div>
						<svg class="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</a>
				</div>
			</div>
		{/if}

		<!-- Navigation buttons -->
		<div class="flex items-center justify-between mt-6">
			<div>
				{#if currentStep > 1}
					<button
						type="button"
						onclick={goPrev}
						class="btn-ghost btn-md flex items-center gap-2"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
						Previous
					</button>
				{:else}
					<a href="/dashboard" class="btn-ghost btn-md">
						Cancel
					</a>
				{/if}
			</div>

			<div>
				{#if currentStep < TOTAL_STEPS}
					<button
						type="button"
						onclick={goNext}
						class="btn-primary btn-md flex items-center gap-2"
					>
						Next
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				{:else}
					<button
						type="submit"
						disabled={isSubmitting || !checkAbout || !checkSkills || !checkLocation}
						class="btn-primary btn-lg flex items-center gap-2"
					>
						{#if isSubmitting}
							<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
							</svg>
							Saving...
						{:else}
							Complete Profile
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						{/if}
					</button>
				{/if}
			</div>
		</div>
	</form>
</div>
