<script lang="ts">
	import { enhance } from '$app/forms';
	import { Badge } from '$lib/components/ui';

	let { data } = $props();

	function formatPrice(pence: number): string {
		return `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
	}

	function formatDate(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<div class="space-y-6">
	<!-- Setup Status Banners -->
	{#if data.setupStatus === 'complete'}
		<div class="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4" role="alert">
			<svg class="h-5 w-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<div>
				<p class="font-medium text-green-800">Payment setup complete</p>
				<p class="text-sm text-green-700">Your Stripe account is verified and ready to receive payments.</p>
			</div>
		</div>
	{:else if data.setupStatus === 'pending'}
		<div class="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4" role="alert">
			<svg class="h-5 w-5 flex-shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<div>
				<p class="font-medium text-amber-800">Setup still in progress</p>
				<p class="text-sm text-amber-700">Stripe needs more information to fully verify your account. Click "Continue Setup" below to finish.</p>
			</div>
		</div>
	{/if}

	{#if data.setupError}
		<div class="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4" role="alert">
			<svg class="h-5 w-5 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<div>
				<p class="font-medium text-red-800">Something went wrong</p>
				<p class="text-sm text-red-700">There was a problem connecting your Stripe account. Please try again.</p>
			</div>
		</div>
	{/if}

	<!-- Header -->
	<div>
		<h1 class="font-display text-2xl font-bold text-secondary">Payments</h1>
		<p class="text-gray-600">Manage your earnings and payment settings</p>
	</div>

	{#if !data.hasStripeAccount || !data.isOnboarded}
		<!-- Stripe Setup Card -->
		<div class="bg-gradient-to-br from-primary to-primary-hover rounded-card p-8 text-white">
			<div class="flex items-start gap-6">
				<div class="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
					<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
						<path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
					</svg>
				</div>
				<div class="flex-1">
					<h2 class="font-display text-2xl font-bold mb-2">
						{data.hasStripeAccount ? 'Complete Your Payment Setup' : 'Set Up Payments'}
					</h2>
					<p class="text-white/80 mb-6">
						{#if data.hasStripeAccount}
							Your Stripe account is created but not fully verified. Complete the setup to start receiving payments.
						{:else}
							Connect your bank account to receive payments directly from clients. We use Stripe for secure, fast payouts.
						{/if}
					</p>
					<form method="POST" action="?/setupStripe" use:enhance>
						<button type="submit" class="btn bg-white text-primary hover:bg-gray-100">
							{data.hasStripeAccount ? 'Continue Setup' : 'Connect with Stripe'}
						</button>
					</form>
				</div>
			</div>

			<div class="mt-8 pt-6 border-t border-white/20 grid sm:grid-cols-3 gap-6 text-sm">
				<div class="flex items-start gap-3">
					<svg class="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
					<span class="text-white/80">Bank-level security</span>
				</div>
				<div class="flex items-start gap-3">
					<svg class="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
					<span class="text-white/80">Fast payouts to your bank</span>
				</div>
				<div class="flex items-start gap-3">
					<svg class="w-5 h-5 text-white/80 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
					<span class="text-white/80">Keep 92% of every booking</span>
				</div>
			</div>
		</div>
	{:else}
		<!-- Earnings Summary -->
		<div class="grid sm:grid-cols-3 gap-4">
			<div class="bg-white rounded-card shadow-card p-6">
				<p class="text-sm text-gray-500 mb-1">This Month</p>
				<p class="font-display text-2xl font-bold text-secondary">
					{formatPrice(data.thisMonthEarnings)}
				</p>
			</div>
			<div class="bg-white rounded-card shadow-card p-6">
				<p class="text-sm text-gray-500 mb-1">Total Earnings</p>
				<p class="font-display text-2xl font-bold text-secondary">
					{formatPrice(data.totalEarnings)}
				</p>
			</div>
			<div class="bg-white rounded-card shadow-card p-6">
				<p class="text-sm text-gray-500 mb-1">Available Balance</p>
				<p class="font-display text-2xl font-bold text-success">
					{#if data.balance?.available?.[0]}
						{formatPrice(data.balance.available[0].amount)}
					{:else}
						£0.00
					{/if}
				</p>
			</div>
		</div>

		<!-- Stripe Status -->
		<div class="bg-white rounded-card shadow-card p-6">
			<div class="flex items-center justify-between mb-4">
				<h2 class="font-display text-lg font-semibold text-secondary">Payment Status</h2>
				<form method="POST" action="?/openDashboard" use:enhance>
					<button type="submit" class="btn-outline btn-sm">
						Open Stripe Dashboard
					</button>
				</form>
			</div>

			<div class="grid sm:grid-cols-2 gap-4">
				<div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
					{#if data.stripeStatus?.chargesEnabled}
						<div class="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
							<svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<div>
							<p class="font-medium text-gray-900">Can Receive Payments</p>
							<p class="text-sm text-gray-500">Your account can accept payments</p>
						</div>
					{:else}
						<div class="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
							<svg class="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<p class="font-medium text-gray-900">Setup Required</p>
							<p class="text-sm text-gray-500">Complete setup to receive payments</p>
						</div>
					{/if}
				</div>

				<div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
					{#if data.stripeStatus?.payoutsEnabled}
						<div class="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
							<svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<div>
							<p class="font-medium text-gray-900">Payouts Enabled</p>
							<p class="text-sm text-gray-500">Funds will transfer to your bank</p>
						</div>
					{:else}
						<div class="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
							<svg class="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<p class="font-medium text-gray-900">Payouts Pending</p>
							<p class="text-sm text-gray-500">Add bank account to receive funds</p>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Recent Payouts -->
		{#if data.payouts.length > 0}
			<div class="bg-white rounded-card shadow-card">
				<div class="p-6 border-b border-gray-100">
					<h2 class="font-display text-lg font-semibold text-secondary">Recent Payouts</h2>
				</div>
				<div class="divide-y divide-gray-100">
					{#each data.payouts as payout}
						<div class="p-4 flex items-center justify-between">
							<div>
								<p class="font-medium text-gray-900">
									{formatPrice(payout.amount)}
								</p>
								<p class="text-sm text-gray-500">
									{formatDate(payout.arrival_date)}
								</p>
							</div>
							<Badge variant={payout.status === 'paid' ? 'success' : 'warning'}>
								{payout.status}
							</Badge>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}

	<!-- Platform Fee Info -->
	<div class="bg-gray-50 rounded-lg p-6">
		<h3 class="font-semibold text-gray-900 mb-2">IgniteGigs Platform Fee</h3>
		<p class="text-sm text-gray-600 mb-4">
			We charge an 8% platform fee on each booking. This covers payment processing, platform maintenance, and customer support. You keep 92% of every booking.
		</p>
		<div class="flex items-center gap-4 text-sm">
			<div class="flex items-center gap-2">
				<span class="w-3 h-3 bg-primary rounded-full"></span>
				<span class="text-gray-600">Your earnings: 92%</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="w-3 h-3 bg-gray-300 rounded-full"></span>
				<span class="text-gray-600">Platform fee: 8%</span>
			</div>
		</div>
	</div>
</div>
