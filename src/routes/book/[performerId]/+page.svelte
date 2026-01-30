<script lang="ts">
	import { enhance } from '$app/forms';
	import { Avatar, Rating } from '$lib/components/ui';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let eventDate = $state(form?.eventDate ?? '');
	let eventTime = $state(form?.eventTime ?? '');
	let eventDuration = $state('2');
	let eventLocation = $state(form?.eventLocation ?? '');
	let eventType = $state(form?.eventType ?? '');
	let eventDetails = $state(form?.eventDetails ?? '');
	let guestCount = $state('');
	let isLoading = $state(false);
	let dateCheckLoading = $state(false);
	let dateConflict = $state(false);

	const performer = data.performer;
	const bookedDates: string[] = data.bookedDates ?? [];

	// Get minimum date (tomorrow)
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	const minDate = tomorrow.toISOString().split('T')[0];

	// Calculate estimated price
	let estimatedPrice = $derived.by(() => {
		const hours = parseInt(eventDuration) || 0;
		if (hours && performer.hourly_rate_pence) {
			return performer.hourly_rate_pence * hours;
		}
		return performer.event_rate_pence || performer.min_rate_pence || 0;
	});

	function formatPrice(pence: number): string {
		return `£${(pence / 100).toLocaleString()}`;
	}

	// Check if selected date is available from the availability table
	function isDateAvailable(date: string): boolean {
		const avail = data.availability.find((a) => a.date === date);
		if (!avail) return true; // Unknown = potentially available
		return avail.is_available && !avail.is_booked;
	}

	// Check if performer already has an active booking on this date
	function isDateBooked(date: string): boolean {
		return bookedDates.includes(date);
	}

	// Client-side availability check when date changes
	async function checkDateAvailability() {
		if (!eventDate) {
			dateConflict = false;
			return;
		}

		// Fast check: use pre-loaded booked dates
		if (isDateBooked(eventDate)) {
			dateConflict = true;
			return;
		}

		// Live check: query the database for the latest booking status
		dateCheckLoading = true;
		dateConflict = false;
		try {
			const res = await fetch(`/api/calendar/${performer.id}?date=${eventDate}`);
			if (res.ok) {
				const result = await res.json();
				dateConflict = result.isBooked === true;
			}
		} catch {
			// If the check fails, allow submission and let the server validate
		} finally {
			dateCheckLoading = false;
		}
	}

	// Derived: true if the selected date has any kind of conflict
	let hasDateConflict = $derived(dateConflict || (eventDate ? isDateBooked(eventDate) : false));

	const eventTypes = [
		'Wedding',
		'Corporate Event',
		'Private Party',
		'Festival',
		'Club Night',
		'Birthday',
		'Hen/Stag Do',
		'Product Launch',
		'Charity Event',
		'Other'
	];
</script>

<svelte:head>
	<title>Book {performer.stage_name || performer.user?.full_name} - IgniteGigs</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8 lg:py-12">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8">
			<a href="/performers/{performer.id}" class="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-4">
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Back to profile
			</a>
			<h1 class="font-display text-3xl font-bold text-secondary">Request Booking</h1>
		</div>

		<div class="grid lg:grid-cols-3 gap-8">
			<!-- Main Form -->
			<div class="lg:col-span-2">
				<div class="bg-white rounded-card shadow-card p-6 lg:p-8">
					<!-- Error Message -->
					{#if form?.error}
						<div class="mb-6 p-4 bg-error-light text-error rounded-lg flex items-start gap-3">
							<svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>{form.error}</span>
						</div>
					{/if}

					<form
						method="POST"
						use:enhance={() => {
							isLoading = true;
							return async ({ update }) => {
								isLoading = false;
								await update();
							};
						}}
					>
						<div class="space-y-6">
							<!-- Event Date & Time -->
							<div class="grid sm:grid-cols-2 gap-4">
								<div>
									<label for="eventDate" class="label">Event Date <span class="text-error">*</span></label>
									<input
										id="eventDate"
										name="eventDate"
										type="date"
										required
										min={minDate}
										bind:value={eventDate}
										onchange={checkDateAvailability}
										class="input"
										class:border-error={hasDateConflict}
									/>
									{#if dateCheckLoading}
										<p class="text-sm text-gray-400 mt-1 flex items-center gap-1">
											<svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
												<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
											</svg>
											Checking availability...
										</p>
									{:else if hasDateConflict}
										<p class="text-sm text-error mt-1 flex items-center gap-1">
											<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
											</svg>
											This performer is already booked on this date. Please choose another date.
										</p>
									{:else if eventDate && !isDateAvailable(eventDate)}
										<p class="text-sm text-warning mt-1">This date may not be available. The performer will confirm.</p>
									{/if}
								</div>
								<div>
									<label for="eventTime" class="label">Start Time</label>
									<input
										id="eventTime"
										name="eventTime"
										type="time"
										bind:value={eventTime}
										class="input"
									/>
								</div>
							</div>

							<!-- Duration -->
							<div>
								<label for="eventDuration" class="label">Performance Duration</label>
								<select id="eventDuration" name="eventDuration" bind:value={eventDuration} class="input">
									<option value="1">1 hour</option>
									<option value="2">2 hours</option>
									<option value="3">3 hours</option>
									<option value="4">4 hours</option>
									<option value="5">5+ hours</option>
								</select>
							</div>

							<!-- Event Location -->
							<div>
								<label for="eventLocation" class="label">Event Location <span class="text-error">*</span></label>
								<input
									id="eventLocation"
									name="eventLocation"
									type="text"
									required
									bind:value={eventLocation}
									class="input"
									placeholder="Venue name or address"
								/>
							</div>

							<!-- Event Type -->
							<div>
								<label for="eventType" class="label">Event Type</label>
								<select id="eventType" name="eventType" bind:value={eventType} class="input">
									<option value="">Select event type</option>
									{#each eventTypes as type}
										<option value={type}>{type}</option>
									{/each}
								</select>
							</div>

							<!-- Guest Count -->
							<div>
								<label for="guestCount" class="label">Expected Guests</label>
								<input
									id="guestCount"
									name="guestCount"
									type="number"
									min="1"
									bind:value={guestCount}
									class="input"
									placeholder="Approximate number of guests"
								/>
							</div>

							<!-- Event Details -->
							<div>
								<label for="eventDetails" class="label">Tell us about your event</label>
								<textarea
									id="eventDetails"
									name="eventDetails"
									rows="4"
									bind:value={eventDetails}
									class="input"
									placeholder="Share any important details about your event, venue, or specific requirements..."
								></textarea>
							</div>

							<!-- Terms -->
							<p class="text-sm text-gray-500">
								By submitting this request, you agree to IgniteGigs'
								<a href="/terms" class="text-primary hover:underline">Terms of Service</a>.
								The performer will review your request and respond within 48 hours.
							</p>

							<!-- Submit -->
							<button
								type="submit"
								disabled={isLoading || !eventDate || !eventLocation || hasDateConflict || dateCheckLoading}
								class="btn-primary btn-lg w-full"
							>
								{#if isLoading}
									<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
									</svg>
									Sending Request...
								{:else}
									Send Booking Request
								{/if}
							</button>
						</div>
					</form>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Performer Card -->
				<div class="bg-white rounded-card shadow-card p-6">
					<div class="flex items-center gap-4 mb-4">
						<Avatar
							src={performer.user?.avatar_url}
							name={performer.stage_name || performer.user?.full_name || 'Performer'}
							size="lg"
						/>
						<div>
							<h3 class="font-display font-semibold text-lg text-secondary">
								{performer.stage_name || performer.user?.full_name}
							</h3>
							<div class="flex items-center gap-1 text-sm">
								{#if performer.total_reviews > 0}
									<Rating value={performer.avg_rating} size="sm" />
									<span class="text-gray-600">({performer.total_reviews})</span>
								{:else}
									<span class="text-gray-500">New performer</span>
								{/if}
							</div>
						</div>
					</div>

					<div class="flex items-center gap-2 text-sm text-gray-500 mb-2">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
						</svg>
						{performer.location_name}
					</div>

					<!-- Categories -->
					<div class="flex gap-2 mt-3">
						{#if performer.performer_category?.includes('fire')}
							<span class="badge-fire text-xs">Fire</span>
						{/if}
						{#if performer.performer_category?.includes('led')}
							<span class="badge-led text-xs">LED</span>
						{/if}
					</div>
				</div>

				<!-- Price Estimate -->
				<div class="bg-white rounded-card shadow-card p-6">
					<h3 class="font-display font-semibold text-secondary mb-4">Estimated Price</h3>

					<div class="space-y-3 text-sm">
						{#if performer.hourly_rate_pence}
							<div class="flex justify-between">
								<span class="text-gray-600">Hourly rate</span>
								<span>{formatPrice(performer.hourly_rate_pence)}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600">Duration</span>
								<span>{eventDuration} hour{parseInt(eventDuration) > 1 ? 's' : ''}</span>
							</div>
						{/if}

						<div class="pt-3 border-t border-gray-100 flex justify-between font-semibold">
							<span>Estimated total</span>
							<span class="text-primary text-lg">{formatPrice(estimatedPrice)}</span>
						</div>
					</div>

					<p class="text-xs text-gray-400 mt-4">
						This is an estimate. Final pricing will be confirmed by the performer.
					</p>
				</div>

				<!-- What Happens Next -->
				<div class="bg-primary/5 rounded-card p-6">
					<h3 class="font-display font-semibold text-secondary mb-4">What happens next?</h3>
					<ol class="space-y-3 text-sm text-gray-600">
						<li class="flex gap-3">
							<span class="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
							<span>Performer reviews your request (usually within 48 hours)</span>
						</li>
						<li class="flex gap-3">
							<span class="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
							<span>They'll send you a quote and any questions</span>
						</li>
						<li class="flex gap-3">
							<span class="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
							<span>Once agreed, pay a 50% deposit to confirm</span>
						</li>
						<li class="flex gap-3">
							<span class="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
							<span>Pay the remaining 50% after the event</span>
						</li>
					</ol>
				</div>
			</div>
		</div>
	</div>
</div>
