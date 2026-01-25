<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { data, form }: { data: typeof import('./$types').PageData; form: ActionData } = $props();

	const profile = data.profile;

	let stageName = $state(profile?.stage_name ?? '');
	let bio = $state(profile?.bio ?? '');
	let tagline = $state(profile?.tagline ?? '');
	let locationName = $state(profile?.location_name ?? '');
	let travelRadius = $state(profile?.travel_radius_miles?.toString() ?? '25');
	let selectedCategories = $state<string[]>(profile?.performer_category ?? []);
	let selectedActTypes = $state<string[]>(profile?.act_types ?? []);
	let hourlyRate = $state(profile?.hourly_rate_pence ? (profile.hourly_rate_pence / 100).toString() : '');
	let eventRate = $state(profile?.event_rate_pence ? (profile.event_rate_pence / 100).toString() : '');
	let minRate = $state(profile?.min_rate_pence ? (profile.min_rate_pence / 100).toString() : '');
	let isLoading = $state(false);

	const categories = [
		{ value: 'fire', label: 'Fire Performance' },
		{ value: 'led', label: 'LED/Glow' },
		{ value: 'circus', label: 'Circus Arts' },
		{ value: 'dance', label: 'Dance' },
		{ value: 'aerial', label: 'Aerial' },
		{ value: 'stilt', label: 'Stilt Walking' }
	];

	const actTypes = [
		{ value: 'poi', label: 'Poi' },
		{ value: 'staff', label: 'Staff' },
		{ value: 'hoop', label: 'Hoop' },
		{ value: 'fans', label: 'Fans' },
		{ value: 'fire_breathing', label: 'Fire Breathing' },
		{ value: 'fire_eating', label: 'Fire Eating' },
		{ value: 'juggling', label: 'Juggling' },
		{ value: 'acrobatics', label: 'Acrobatics' },
		{ value: 'contortion', label: 'Contortion' },
		{ value: 'silk', label: 'Aerial Silk' },
		{ value: 'trapeze', label: 'Trapeze' },
		{ value: 'lyra', label: 'Lyra/Hoop' },
		{ value: 'contemporary', label: 'Contemporary Dance' },
		{ value: 'bellydance', label: 'Bellydance' },
		{ value: 'other', label: 'Other' }
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
</script>

<div class="space-y-6 max-w-3xl">
	<!-- Header -->
	<div>
		<h1 class="font-display text-2xl font-bold text-secondary">
			{data.isNewProfile ? 'Create Your Profile' : 'Edit Profile'}
		</h1>
		<p class="text-gray-600">
			{data.isNewProfile
				? 'Set up your performer profile to start receiving bookings'
				: 'Update your profile information and rates'}
		</p>
	</div>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<div class="p-4 bg-success/10 text-success rounded-lg flex items-center gap-3">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			{form.message}
		</div>
	{/if}

	{#if form?.error}
		<div class="p-4 bg-error/10 text-error rounded-lg flex items-center gap-3">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			{form.error}
		</div>
	{/if}

	<form
		method="POST"
		action="?/updateProfile"
		use:enhance={() => {
			isLoading = true;
			return async ({ update }) => {
				isLoading = false;
				await update();
			};
		}}
		class="space-y-8"
	>
		<!-- Basic Info -->
		<div class="bg-white rounded-card shadow-card p-6">
			<h2 class="font-display text-lg font-semibold text-secondary mb-4">Basic Information</h2>

			<div class="space-y-4">
				<div>
					<label for="stageName" class="label">Stage Name</label>
					<input
						id="stageName"
						name="stageName"
						type="text"
						bind:value={stageName}
						class="input"
						placeholder="Your performer name"
					/>
				</div>

				<div>
					<label for="tagline" class="label">Tagline</label>
					<input
						id="tagline"
						name="tagline"
						type="text"
						bind:value={tagline}
						class="input"
						placeholder="A short catchy description (e.g., 'Mesmerizing fire artistry')"
						maxlength="100"
					/>
					<p class="text-xs text-gray-400 mt-1">{tagline.length}/100 characters</p>
				</div>

				<div>
					<label for="bio" class="label">Bio</label>
					<textarea
						id="bio"
						name="bio"
						rows="5"
						bind:value={bio}
						class="input"
						placeholder="Tell clients about yourself, your experience, and what makes your performance special..."
					></textarea>
				</div>
			</div>
		</div>

		<!-- Location -->
		<div class="bg-white rounded-card shadow-card p-6">
			<h2 class="font-display text-lg font-semibold text-secondary mb-4">Location</h2>

			<div class="grid sm:grid-cols-2 gap-4">
				<div>
					<label for="locationName" class="label">
						Based In <span class="text-error">*</span>
					</label>
					<input
						id="locationName"
						name="locationName"
						type="text"
						required
						bind:value={locationName}
						class="input"
						placeholder="City, Region"
					/>
				</div>

				<div>
					<label for="travelRadius" class="label">Travel Radius (miles)</label>
					<select id="travelRadius" name="travelRadius" bind:value={travelRadius} class="input">
						<option value="10">10 miles</option>
						<option value="25">25 miles</option>
						<option value="50">50 miles</option>
						<option value="100">100 miles</option>
						<option value="200">200+ miles (nationwide)</option>
					</select>
				</div>
			</div>
		</div>

		<!-- Categories -->
		<div class="bg-white rounded-card shadow-card p-6">
			<h2 class="font-display text-lg font-semibold text-secondary mb-4">
				Categories <span class="text-error">*</span>
			</h2>
			<p class="text-sm text-gray-500 mb-4">Select all that apply to your performance</p>

			<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
				{#each categories as cat}
					<button
						type="button"
						class="p-3 rounded-lg border-2 text-left transition-all {selectedCategories.includes(cat.value)
							? 'border-primary bg-primary/5 text-primary'
							: 'border-gray-200 hover:border-gray-300'}"
						onclick={() => toggleCategory(cat.value)}
					>
						<input
							type="checkbox"
							name="categories"
							value={cat.value}
							checked={selectedCategories.includes(cat.value)}
							class="sr-only"
						/>
						<span class="font-medium">{cat.label}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Act Types -->
		<div class="bg-white rounded-card shadow-card p-6">
			<h2 class="font-display text-lg font-semibold text-secondary mb-4">Act Types</h2>
			<p class="text-sm text-gray-500 mb-4">What props/styles do you perform?</p>

			<div class="flex flex-wrap gap-2">
				{#each actTypes as act}
					<button
						type="button"
						class="px-4 py-2 rounded-full text-sm font-medium transition-all {selectedActTypes.includes(act.value)
							? 'bg-primary text-white'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						onclick={() => toggleActType(act.value)}
					>
						<input
							type="checkbox"
							name="actTypes"
							value={act.value}
							checked={selectedActTypes.includes(act.value)}
							class="sr-only"
						/>
						{act.label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Pricing -->
		<div class="bg-white rounded-card shadow-card p-6">
			<h2 class="font-display text-lg font-semibold text-secondary mb-4">Pricing</h2>
			<p class="text-sm text-gray-500 mb-4">
				Set your rates. You can always provide custom quotes for specific events.
			</p>

			<div class="grid sm:grid-cols-3 gap-4">
				<div>
					<label for="hourlyRate" class="label">Hourly Rate (£)</label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">£</span>
						<input
							id="hourlyRate"
							name="hourlyRate"
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
					<label for="eventRate" class="label">Event Rate (£)</label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">£</span>
						<input
							id="eventRate"
							name="eventRate"
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
					<label for="minRate" class="label">Minimum Booking (£)</label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">£</span>
						<input
							id="minRate"
							name="minRate"
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
		</div>

		<!-- Submit -->
		<div class="flex justify-end gap-4">
			<a href="/dashboard" class="btn-outline">Cancel</a>
			<button type="submit" disabled={isLoading} class="btn-primary">
				{#if isLoading}
					<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
					</svg>
					Saving...
				{:else}
					Save Profile
				{/if}
			</button>
		</div>
	</form>
</div>
