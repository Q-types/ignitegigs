<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { data, form }: { data: typeof import('./$types').PageData; form: ActionData } = $props();

	let reason = $state(form?.reason ?? '');
	let description = $state(form?.description ?? '');
	let evidenceUrls = $state(form?.evidenceUrlsRaw ?? '');
	let isSubmitting = $state(false);

	const charCount = $derived(description.trim().length);
	const isDescriptionValid = $derived(charCount >= 50);

	const booking = data.booking;

	const reasonOptions = [
		{ value: '', label: 'Select a reason...' },
		{ value: 'no_show', label: 'No Show - Performer did not attend' },
		{ value: 'poor_quality', label: 'Poor Quality - Performance did not meet expectations' },
		{ value: 'safety_concern', label: 'Safety Concern - Unsafe behaviour or conditions' },
		{ value: 'payment_issue', label: 'Payment Issue - Problem with payment or pricing' },
		{ value: 'harassment', label: 'Harassment - Inappropriate behaviour' },
		{ value: 'other', label: 'Other - Another issue not listed above' }
	];

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			weekday: 'short',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function formatPrice(pence: number | null): string {
		if (!pence) return '-';
		return `\u00A3${(pence / 100).toLocaleString()}`;
	}
</script>

<div class="max-w-3xl mx-auto space-y-6">
	<!-- Back Link -->
	<a
		href="/dashboard/bookings/{booking.id}"
		class="inline-flex items-center text-sm text-gray-500 hover:text-[#FF6B35]"
	>
		<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
		Back to booking
	</a>

	<!-- Header -->
	<div>
		<h1 class="font-display text-2xl font-bold text-[#1E1E2E]">Raise a Dispute</h1>
		<p class="text-gray-600 mt-1">
			If you have an issue with this booking, please describe it below. Our team will review and
			respond within 48 hours.
		</p>
	</div>

	<!-- Error Message -->
	{#if form?.error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
			<div class="flex items-start gap-3">
				<svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p>{form.error}</p>
			</div>
		</div>
	{/if}

	<!-- Booking Summary Card -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
		<h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Booking Summary</h2>
		<div class="grid sm:grid-cols-2 gap-4">
			<div>
				<p class="text-sm text-gray-500">Booking ID</p>
				<p class="font-mono text-sm text-gray-900">{booking.id.slice(0, 8)}...</p>
			</div>
			<div>
				<p class="text-sm text-gray-500">Event Date</p>
				<p class="font-medium text-gray-900">{formatDate(booking.event_date)}</p>
			</div>
			<div>
				<p class="text-sm text-gray-500">
					{data.isClient ? 'Performer' : 'Client'}
				</p>
				<p class="font-medium text-gray-900">
					{#if data.isClient}
						{booking.performer?.stage_name || booking.performer?.user?.full_name || 'Performer'}
					{:else}
						{booking.client?.full_name || 'Client'}
					{/if}
				</p>
			</div>
			<div>
				<p class="text-sm text-gray-500">Price</p>
				<p class="font-medium text-gray-900">
					{formatPrice(booking.agreed_price_pence || booking.quoted_price_pence)}
				</p>
			</div>
			<div>
				<p class="text-sm text-gray-500">Location</p>
				<p class="font-medium text-gray-900">{booking.event_location}</p>
			</div>
			<div>
				<p class="text-sm text-gray-500">Status</p>
				<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
					{booking.status}
				</span>
			</div>
		</div>
	</div>

	<!-- Dispute Form -->
	<form
		method="POST"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				isSubmitting = false;
				await update();
			};
		}}
		class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
	>
		<h2 class="font-display text-lg font-semibold text-[#1E1E2E]">Dispute Details</h2>

		<!-- Reason -->
		<div>
			<label for="reason" class="block text-sm font-medium text-gray-700 mb-1">
				Reason for Dispute <span class="text-red-500">*</span>
			</label>
			<select
				id="reason"
				name="reason"
				bind:value={reason}
				required
				class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 focus:outline-none transition-colors"
			>
				{#each reasonOptions as opt}
					<option value={opt.value} disabled={opt.value === ''}>{opt.label}</option>
				{/each}
			</select>
		</div>

		<!-- Description -->
		<div>
			<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
				Description <span class="text-red-500">*</span>
			</label>
			<textarea
				id="description"
				name="description"
				bind:value={description}
				required
				rows="6"
				minlength="50"
				placeholder="Please provide a detailed description of the issue. Include dates, times, and any relevant details that will help us investigate (minimum 50 characters)..."
				class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 focus:outline-none transition-colors resize-y"
			></textarea>
			<div class="flex justify-between mt-1">
				<p class="text-xs {isDescriptionValid ? 'text-green-600' : 'text-gray-500'}">
					{#if charCount > 0 && !isDescriptionValid}
						{50 - charCount} more characters needed
					{:else if isDescriptionValid}
						Minimum met
					{:else}
						Minimum 50 characters required
					{/if}
				</p>
				<p class="text-xs text-gray-400">{charCount} characters</p>
			</div>
		</div>

		<!-- Evidence URLs -->
		<div>
			<label for="evidence_urls" class="block text-sm font-medium text-gray-700 mb-1">
				Evidence URLs
				<span class="text-gray-400 font-normal">(optional)</span>
			</label>
			<textarea
				id="evidence_urls"
				name="evidence_urls"
				bind:value={evidenceUrls}
				rows="3"
				placeholder="Paste links to photos, videos, or documents (one URL per line)..."
				class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 focus:outline-none transition-colors resize-y font-mono text-sm"
			></textarea>
			<p class="text-xs text-gray-500 mt-1">
				Add links to any supporting evidence. Enter one URL per line.
			</p>
		</div>

		<!-- Important Notice -->
		<div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
			<div class="flex items-start gap-3">
				<svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
				</svg>
				<div>
					<p class="text-sm font-medium text-amber-800">Please note</p>
					<p class="text-sm text-amber-700 mt-1">
						Filing a dispute will change the booking status to "disputed". Our admin team will
						review your case and may contact both parties for additional information. False or
						frivolous disputes may result in account restrictions.
					</p>
				</div>
			</div>
		</div>

		<!-- Submit -->
		<div class="flex items-center gap-4 pt-2">
			<button
				type="submit"
				disabled={isSubmitting || !reason || !isDescriptionValid}
				class="px-6 py-2.5 bg-[#FF6B35] text-white font-medium rounded-lg hover:bg-[#FF6B35]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				{#if isSubmitting}
					<span class="inline-flex items-center gap-2">
						<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Submitting...
					</span>
				{:else}
					Submit Dispute
				{/if}
			</button>
			<a
				href="/dashboard/bookings/{booking.id}"
				class="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
			>
				Cancel
			</a>
		</div>
	</form>
</div>
