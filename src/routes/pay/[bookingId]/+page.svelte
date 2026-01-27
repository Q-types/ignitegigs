<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js';

	let { data } = $props();

	let stripe: Stripe | null = $state(null);
	let elements: StripeElements | null = $state(null);
	let isProcessing = $state(false);
	let errorMessage = $state('');
	let paymentElementReady = $state(false);

	const booking = data.booking;

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			weekday: 'short',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	onMount(async () => {
		stripe = await loadStripe(data.publishableKey);

		if (stripe) {
			elements = stripe.elements({
				clientSecret: data.clientSecret,
				appearance: {
					theme: 'stripe',
					variables: {
						colorPrimary: '#FF6B35',
						colorBackground: '#ffffff',
						colorText: '#1E1E2E',
						colorDanger: '#EF4444',
						fontFamily: 'system-ui, sans-serif',
						borderRadius: '8px'
					}
				}
			});

			const paymentElement = elements.create('payment', {
				layout: 'tabs'
			});

			paymentElement.mount('#payment-element');
			paymentElement.on('ready', () => {
				paymentElementReady = true;
			});
		}
	});

	async function handleSubmit() {
		if (!stripe || !elements) return;

		isProcessing = true;
		errorMessage = '';

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/dashboard/bookings/${booking.id}?payment=success`
			}
		});

		if (error) {
			errorMessage = error.message || 'Payment failed. Please try again.';
			isProcessing = false;
		}
	}
</script>

<svelte:head>
	<title>Pay {data.isDeposit ? 'Deposit' : 'Balance'} - IgniteGigs</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8 lg:py-12">
	<div class="max-w-2xl mx-auto px-4">
		<!-- Header -->
		<div class="mb-8">
			<a href="/dashboard/bookings/{booking.id}" class="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-4">
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Back to booking
			</a>
			<h1 class="font-display text-2xl lg:text-3xl font-bold text-secondary">
				{data.isDeposit ? 'Pay Deposit' : 'Pay Remaining Balance'}
			</h1>
		</div>

		<div class="grid gap-6">
			<!-- Order Summary -->
			<div class="bg-white rounded-card shadow-card p-6">
				<h2 class="font-display text-lg font-semibold text-secondary mb-4">Booking Summary</h2>

				<div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
					<div class="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
						<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
						</svg>
					</div>
					<div>
						<p class="font-semibold text-gray-900">
							{booking.performer?.stage_name || booking.performer?.user?.full_name}
						</p>
						<p class="text-sm text-gray-500">
							{formatDate(booking.event_date)}
						</p>
						<p class="text-sm text-gray-500">{booking.event_location}</p>
					</div>
				</div>

				<div class="space-y-3 text-sm">
					<div class="flex justify-between">
						<span class="text-gray-600">Total booking price</span>
						<span class="font-medium">{data.formattedTotal}</span>
					</div>
					{#if data.isDeposit}
						<div class="flex justify-between">
							<span class="text-gray-600">Deposit (50%)</span>
							<span class="font-medium">{data.formattedAmount}</span>
						</div>
						<p class="text-xs text-gray-400">
							The remaining 50% will be due after the event
						</p>
					{:else}
						<div class="flex justify-between">
							<span class="text-gray-600">Remaining balance</span>
							<span class="font-medium">{data.formattedAmount}</span>
						</div>
					{/if}
				</div>

				<div class="mt-6 pt-6 border-t border-gray-100">
					<div class="flex justify-between items-center">
						<span class="font-semibold text-gray-900">Amount to pay</span>
						<span class="font-display text-2xl font-bold text-primary">{data.formattedAmount}</span>
					</div>
				</div>
			</div>

			<!-- Payment Form -->
			<div class="bg-white rounded-card shadow-card p-6">
				<h2 class="font-display text-lg font-semibold text-secondary mb-4">Payment Details</h2>

				{#if errorMessage}
					<div class="mb-4 p-4 bg-error/10 text-error rounded-lg text-sm">
						{errorMessage}
					</div>
				{/if}

				<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
					<div id="payment-element" class="mb-6">
						{#if !paymentElementReady}
							<div class="flex items-center justify-center py-8">
								<svg class="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
								</svg>
							</div>
						{/if}
					</div>

					<button
						type="submit"
						disabled={isProcessing || !paymentElementReady}
						class="btn-primary btn-lg w-full"
					>
						{#if isProcessing}
							<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
							</svg>
							Processing...
						{:else}
							Pay {data.formattedAmount}
						{/if}
					</button>
				</form>

				<!-- Security Note -->
				<div class="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
					<span>Payments secured by Stripe</span>
				</div>
			</div>

			<!-- Cancellation Policy -->
			<div class="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
				<p class="font-medium text-gray-900 mb-2">Cancellation Policy</p>
				<p>
					Full refund if cancelled more than 7 days before the event.
					50% refund if cancelled 3-7 days before.
					No refund within 3 days of the event.
				</p>
			</div>
		</div>
	</div>
</div>
