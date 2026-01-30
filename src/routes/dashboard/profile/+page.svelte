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
	let showRate = $state(profile?.show_rate_pence ? (profile.show_rate_pence / 100).toString() : '');
	let isLoading = $state(false);

	const categories = [
		{ value: 'fire', label: 'Fire Performance' },
		{ value: 'led', label: 'LED/Glow' },
		{ value: 'circus', label: 'Circus Arts' },
		{ value: 'dance', label: 'Dance' },
		{ value: 'aerial', label: 'Aerial' },
		{ value: 'stilt', label: 'Stilt Walking' },
		{ value: 'juggling', label: 'Juggling' },
		{ value: 'acrobatics', label: 'Acrobatics' },
		{ value: 'caricature', label: 'Caricature' },
		{ value: 'comedy', label: 'Comedy' },
		{ value: 'walkabout', label: 'Walkabout' },
		{ value: 'magic', label: 'Magic' }
	];

	const actTypeGroups = [
		{
			label: 'Fire Props',
			types: [
				{ value: 'poi', label: 'Poi' },
				{ value: 'staff', label: 'Staff' },
				{ value: 'contact_staff', label: 'Contact Staff' },
				{ value: 'rope_dart', label: 'Rope Dart' },
				{ value: 'meteor_hammer', label: 'Meteor Hammer' },
				{ value: 'sword', label: 'Sword' },
				{ value: 'contact_sword', label: 'Contact Sword' },
				{ value: 'hoop', label: 'Hoop' },
				{ value: 'fans', label: 'Fans' },
				{ value: 'palm_candles', label: 'Palm Candles' },
				{ value: 'fire_breathing', label: 'Fire Breathing' },
				{ value: 'fire_eating', label: 'Fire Eating' },
				{ value: 'fire_whip', label: 'Fire Whip' },
				{ value: 'fire_fingers', label: 'Fire Fingers' },
				{ value: 'dragon_staff', label: 'Dragon Staff' },
				{ value: 'fire_leviwand', label: 'Fire Leviwand' }
			]
		},
		{
			label: 'LED Props',
			types: [
				{ value: 'led_poi', label: 'LED Poi' },
				{ value: 'led_staff', label: 'LED Staff' },
				{ value: 'led_hoop', label: 'LED Hoop' },
				{ value: 'led_fans', label: 'LED Fans' },
				{ value: 'pixel_poi', label: 'Pixel Poi' },
				{ value: 'led_leviwand', label: 'LED Leviwand' }
			]
		},
		{
			label: 'Juggling',
			types: [
				{ value: 'balls', label: 'Balls' },
				{ value: 'clubs', label: 'Clubs' },
				{ value: 'rings', label: 'Rings' },
				{ value: 'diabolo', label: 'Diabolo' },
				{ value: 'devil_sticks', label: 'Devil Sticks' },
				{ value: 'cigar_boxes', label: 'Cigar Boxes' }
			]
		},
		{
			label: 'Aerial',
			types: [
				{ value: 'silk', label: 'Aerial Silk' },
				{ value: 'trapeze', label: 'Trapeze' },
				{ value: 'lyra', label: 'Lyra/Hoop' },
				{ value: 'corde_lisse', label: 'Rope' },
				{ value: 'aerial_net', label: 'Aerial Net' }
			]
		},
		{
			label: 'Acrobatics',
			types: [
				{ value: 'tumbling', label: 'Tumbling' },
				{ value: 'hand_balancing', label: 'Hand Balancing' },
				{ value: 'partner_acrobatics', label: 'Partner Acrobatics' },
				{ value: 'contortion', label: 'Contortion' }
			]
		},
		{
			label: 'Dance',
			types: [
				{ value: 'contemporary', label: 'Contemporary Dance' },
				{ value: 'bellydance', label: 'Bellydance' },
				{ value: 'breakdancing', label: 'Breakdancing' },
				{ value: 'ballet', label: 'Ballet' },
				{ value: 'latin', label: 'Latin' }
			]
		},
		{
			label: 'Magic',
			types: [
				{ value: 'close_up_magic', label: 'Close-Up Magic' },
				{ value: 'stage_magic', label: 'Stage Magic' },
				{ value: 'mentalism', label: 'Mentalism' },
				{ value: 'card_magic', label: 'Card Magic' },
				{ value: 'illusions', label: 'Illusions' }
			]
		},
		{
			label: 'Comedy',
			types: [
				{ value: 'physical_comedy', label: 'Physical Comedy' },
				{ value: 'stand_up', label: 'Stand Up' },
				{ value: 'improvisation', label: 'Improvisation' },
				{ value: 'clowning', label: 'Clowning' }
			]
		},
		{
			label: 'Walkabout',
			types: [
				{ value: 'character_walkabout', label: 'Character Walkabout' },
				{ value: 'living_statue', label: 'Living Statue' },
				{ value: 'stilt_character', label: 'Stilt Character' }
			]
		},
		{
			label: 'Caricature',
			types: [
				{ value: 'live_caricature', label: 'Live Caricature' },
				{ value: 'digital_caricature', label: 'Digital Caricature' }
			]
		},
		{
			label: 'Other',
			types: [
				{ value: 'other', label: 'Other' }
			]
		}
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

			<div class="space-y-6">
				{#each actTypeGroups as group}
					<div>
						<h3 class="text-sm font-semibold text-gray-700 mb-2">{group.label}</h3>
						<div class="flex flex-wrap gap-2">
							{#each group.types as act}
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
				{/each}
			</div>
		</div>

		<!-- Pricing -->
		<div class="bg-white rounded-card shadow-card p-6">
			<h2 class="font-display text-lg font-semibold text-secondary mb-4">Pricing</h2>
			<p class="text-sm text-gray-500 mb-4">
				Set your rates. You can always provide custom quotes for specific events.
			</p>

			<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
					<label for="showRate" class="label">Per Show Rate (£)</label>
					<div class="relative">
						<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">£</span>
						<input
							id="showRate"
							name="showRate"
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
