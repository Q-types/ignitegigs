<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let profile = $derived(data.profile);
	let verificationTier = $derived(profile?.verification_tier ?? 'community');
	let hasEquity = $derived(!!profile?.equity_verified);
	let hasPLI = $derived(!!profile?.pli_verified);

	// Collapsible sections
	let equityOpen = $state(false);
	let pliOpen = $state(false);

	// Form state
	let equityMemberId = $state(profile?.equity_member_id ?? '');
	let pliProvider = $state(profile?.pli_provider ?? '');
	let pliPolicyNumber = $state(profile?.pli_policy_number ?? '');
	let pliExpiryDate = $state(profile?.pli_expiry_date ?? '');
	let pliDocumentUrl = $state(profile?.pli_document_url ?? '');

	// Loading states
	let isSubmittingEquity = $state(false);
	let isSubmittingPLI = $state(false);
	let isRemovingPLI = $state(false);

	// Show remove PLI confirmation
	let showRemoveConfirm = $state(false);

	// Check if PLI is expiring within 30 days
	let pliExpiringWarning = $derived(() => {
		if (!profile?.pli_expiry_date) return false;
		const expiry = new Date(profile.pli_expiry_date);
		const thirtyDaysFromNow = new Date();
		thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
		return expiry <= thirtyDaysFromNow && expiry > new Date();
	});

	let pliExpired = $derived(() => {
		if (!profile?.pli_expiry_date) return false;
		return new Date(profile.pli_expiry_date) <= new Date();
	});

	function formatDate(dateStr: string | null | undefined): string {
		if (!dateStr) return 'N/A';
		return new Date(dateStr).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function getTierLabel(tier: string): string {
		switch (tier) {
			case 'verified_pro':
				return 'Verified Pro';
			case 'insured':
				return 'Insured Performer';
			default:
				return 'Community Member';
		}
	}

	function getTierColor(tier: string): string {
		switch (tier) {
			case 'verified_pro':
				return 'bg-primary/10 text-primary border-primary/30';
			case 'insured':
				return 'bg-success/10 text-success border-success/30';
			default:
				return 'bg-gray-100 text-gray-600 border-gray-200';
		}
	}
</script>

<svelte:head>
	<title>Verification - IgniteGigs</title>
</svelte:head>

<div class="space-y-6 max-w-3xl">
	<!-- Header -->
	<div>
		<h1 class="font-display text-2xl lg:text-3xl font-bold text-secondary">Verification &amp; Insurance</h1>
		<p class="text-gray-600 mt-1">
			Manage your verification status, Equity membership, and public liability insurance.
		</p>
	</div>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<div class="rounded-lg bg-success/10 border border-success/30 p-4">
			<div class="flex items-center gap-3">
				<svg class="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="text-sm text-success font-medium">{form.message}</p>
			</div>
		</div>
	{/if}

	{#if form?.error}
		<div class="rounded-lg bg-error/10 border border-error/30 p-4">
			<div class="flex items-center gap-3">
				<svg class="w-5 h-5 text-error flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="text-sm text-error font-medium">{form.error}</p>
			</div>
		</div>
	{/if}

	<!-- Section 1: Current Verification Status -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
		<div class="flex items-center justify-between mb-4">
			<h2 class="font-display text-lg font-semibold text-secondary">Current Status</h2>
			<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border {getTierColor(verificationTier)}">
				{#if verificationTier === 'verified_pro'}
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
				{:else if verificationTier === 'insured'}
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
				{:else}
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				{/if}
				{getTierLabel(verificationTier)}
			</span>
		</div>

		<p class="text-sm text-gray-600 mb-6">
			{#if verificationTier === 'verified_pro'}
				You have the highest trust level. Your profile has priority placement in search results and displays the Verified Pro badge to clients.
			{:else if verificationTier === 'insured'}
				Your profile is visible to clients and you can receive bookings. Upload your Equity membership to reach Verified Pro status.
			{:else}
				Your profile is not yet visible to clients for booking. Add your public liability insurance or Equity membership below to unlock bookings.
			{/if}
		</p>

		<!-- Tier Explanation -->
		<div class="space-y-3">
			<h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Verification Tiers</h3>

			<div class="grid gap-3">
				<!-- Community -->
				<div class="flex items-start gap-3 p-3 rounded-lg {verificationTier === 'community' ? 'bg-gray-50 ring-1 ring-gray-300' : 'bg-gray-50/50'}">
					<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
						<svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
					</div>
					<div>
						<p class="text-sm font-medium text-gray-900">Community Member</p>
						<p class="text-xs text-gray-500 mt-0.5">
							Can browse, connect with other performers, and join discussions. Not visible to clients for booking.
						</p>
					</div>
					{#if verificationTier === 'community'}
						<span class="ml-auto text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full flex-shrink-0">Current</span>
					{/if}
				</div>

				<!-- Insured -->
				<div class="flex items-start gap-3 p-3 rounded-lg {verificationTier === 'insured' ? 'bg-success/5 ring-1 ring-success/30' : 'bg-gray-50/50'}">
					<div class="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
						<svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
					</div>
					<div>
						<p class="text-sm font-medium text-gray-900">Insured Performer</p>
						<p class="text-xs text-gray-500 mt-0.5">
							Has valid PLI uploaded. Visible to clients. Can receive bookings.
						</p>
					</div>
					{#if verificationTier === 'insured'}
						<span class="ml-auto text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full flex-shrink-0">Current</span>
					{/if}
				</div>

				<!-- Verified Pro -->
				<div class="flex items-start gap-3 p-3 rounded-lg {verificationTier === 'verified_pro' ? 'bg-primary/5 ring-1 ring-primary/30' : 'bg-gray-50/50'}">
					<div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
						<svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
						</svg>
					</div>
					<div>
						<p class="text-sm font-medium text-gray-900">Verified Pro</p>
						<p class="text-xs text-gray-500 mt-0.5">
							Equity union member or admin verified. Highest trust badge. Priority in search results.
						</p>
					</div>
					{#if verificationTier === 'verified_pro'}
						<span class="ml-auto text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full flex-shrink-0">Current</span>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Section 2: Equity Union Membership -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
		<button
			type="button"
			class="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
			onclick={() => (equityOpen = !equityOpen)}
			aria-expanded={equityOpen}
		>
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
					<svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
				</div>
				<div>
					<h2 class="font-display text-lg font-semibold text-secondary">Equity Union Membership</h2>
					<p class="text-sm text-gray-500 mt-0.5">
						{#if hasEquity}
							Verified member
						{:else}
							Link your Equity membership for Verified Pro status
						{/if}
					</p>
				</div>
			</div>
			<div class="flex items-center gap-2">
				{#if hasEquity}
					<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
						Verified
					</span>
				{/if}
				<svg
					class="w-5 h-5 text-gray-400 transition-transform duration-200 {equityOpen ? 'rotate-180' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</button>

		{#if equityOpen}
			<div class="px-6 pb-6 border-t border-gray-100 pt-4">
				{#if hasEquity}
					<!-- Already verified -->
					<div class="flex items-center gap-3 p-4 bg-success/5 rounded-lg border border-success/20">
						<svg class="w-6 h-6 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<div>
							<p class="text-sm font-medium text-gray-900">Equity Membership Verified</p>
							<p class="text-sm text-gray-600 mt-0.5">
								Member ID: <span class="font-mono font-medium">{profile?.equity_member_id}</span>
							</p>
							{#if profile?.equity_verified_at}
								<p class="text-xs text-gray-400 mt-1">
									Verified on {formatDate(profile.equity_verified_at)}
								</p>
							{/if}
						</div>
					</div>
				{:else}
					<!-- Equity form -->
					<div class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
						<div class="flex gap-3">
							<svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<div>
								<p class="text-sm font-medium text-blue-900">About Equity Membership</p>
								<p class="text-sm text-blue-700 mt-1">
									Equity members automatically receive PLI coverage through their union membership and
									get the Verified Pro badge, which gives you priority placement in search results and
									the highest trust indicator for clients.
								</p>
							</div>
						</div>
					</div>

					<form
						method="POST"
						action="?/submitEquity"
						use:enhance={() => {
							isSubmittingEquity = true;
							return async ({ update }) => {
								isSubmittingEquity = false;
								await update();
							};
						}}
					>
						<div class="space-y-4">
							<div>
								<label for="equityMemberId" class="label block text-sm font-medium text-gray-700 mb-1">
									Equity Member ID
								</label>
								<input
									type="text"
									id="equityMemberId"
									name="equityMemberId"
									class="input w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
									placeholder="e.g. EQ-12345678"
									bind:value={equityMemberId}
									required
									minlength="3"
								/>
								<p class="text-xs text-gray-400 mt-1">Enter your Equity union member ID exactly as it appears on your membership card.</p>
							</div>

							<button
								type="submit"
								class="btn-primary inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={isSubmittingEquity || !equityMemberId || equityMemberId.trim().length < 3}
							>
								{#if isSubmittingEquity}
									<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
									</svg>
									Submitting...
								{:else}
									Submit Equity Membership
								{/if}
							</button>
						</div>
					</form>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Section 3: Public Liability Insurance -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
		<button
			type="button"
			class="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
			onclick={() => (pliOpen = !pliOpen)}
			aria-expanded={pliOpen}
		>
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
					<svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
				</div>
				<div>
					<h2 class="font-display text-lg font-semibold text-secondary">Public Liability Insurance</h2>
					<p class="text-sm text-gray-500 mt-0.5">
						{#if hasPLI}
							Insurance on file
						{:else}
							Upload your PLI to become visible to clients
						{/if}
					</p>
				</div>
			</div>
			<div class="flex items-center gap-2">
				{#if hasPLI && pliExpired()}
					<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						Expired
					</span>
				{:else if hasPLI && pliExpiringWarning()}
					<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						Expiring Soon
					</span>
				{:else if hasPLI}
					<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
						Active
					</span>
				{/if}
				<svg
					class="w-5 h-5 text-gray-400 transition-transform duration-200 {pliOpen ? 'rotate-180' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</div>
		</button>

		{#if pliOpen}
			<div class="px-6 pb-6 border-t border-gray-100 pt-4">
				{#if hasPLI}
					<!-- Existing PLI details -->
					{#if pliExpired()}
						<div class="mb-4 p-4 bg-error/5 rounded-lg border border-error/20">
							<div class="flex gap-3">
								<svg class="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<div>
									<p class="text-sm font-medium text-error">Your insurance has expired</p>
									<p class="text-sm text-gray-600 mt-1">
										Please update your PLI details with a current policy to remain visible to clients.
									</p>
								</div>
							</div>
						</div>
					{:else if pliExpiringWarning()}
						<div class="mb-4 p-4 bg-warning/5 rounded-lg border border-warning/20">
							<div class="flex gap-3">
								<svg class="w-5 h-5 text-warning flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<div>
									<p class="text-sm font-medium text-warning">Your insurance is expiring soon</p>
									<p class="text-sm text-gray-600 mt-1">
										Your PLI expires on {formatDate(profile?.pli_expiry_date)}. Please renew before it expires to maintain your booking status.
									</p>
								</div>
							</div>
						</div>
					{/if}

					<div class="bg-gray-50 rounded-lg p-4 space-y-3">
						<div class="grid grid-cols-2 gap-4">
							<div>
								<p class="text-xs text-gray-400 uppercase tracking-wide font-medium">Provider</p>
								<p class="text-sm font-medium text-gray-900 mt-0.5">{profile?.pli_provider}</p>
							</div>
							<div>
								<p class="text-xs text-gray-400 uppercase tracking-wide font-medium">Policy Number</p>
								<p class="text-sm font-medium text-gray-900 font-mono mt-0.5">{profile?.pli_policy_number}</p>
							</div>
							<div>
								<p class="text-xs text-gray-400 uppercase tracking-wide font-medium">Expiry Date</p>
								<p class="text-sm font-medium mt-0.5 {pliExpired() ? 'text-error' : pliExpiringWarning() ? 'text-warning' : 'text-gray-900'}">
									{formatDate(profile?.pli_expiry_date)}
								</p>
							</div>
							{#if profile?.pli_document_url}
								<div>
									<p class="text-xs text-gray-400 uppercase tracking-wide font-medium">Document</p>
									<a
										href={profile.pli_document_url}
										target="_blank"
										rel="noopener noreferrer"
										class="text-sm text-primary hover:underline mt-0.5 inline-flex items-center gap-1"
									>
										View document
										<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
										</svg>
									</a>
								</div>
							{/if}
						</div>
						{#if profile?.pli_verified_at}
							<p class="text-xs text-gray-400 pt-2 border-t border-gray-200">
								Added on {formatDate(profile.pli_verified_at)}
							</p>
						{/if}
					</div>

					<!-- Update PLI form (collapsed by default when existing) -->
					<div class="mt-4 pt-4 border-t border-gray-100">
						<p class="text-sm font-medium text-gray-700 mb-3">Update Insurance Details</p>
						<form
							method="POST"
							action="?/submitPLI"
							use:enhance={() => {
								isSubmittingPLI = true;
								return async ({ update }) => {
									isSubmittingPLI = false;
									await update();
								};
							}}
						>
							<div class="space-y-4">
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label for="pliProvider" class="label block text-sm font-medium text-gray-700 mb-1">
											Insurance Provider <span class="text-error">*</span>
										</label>
										<input
											type="text"
											id="pliProvider"
											name="pliProvider"
											class="input w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
											placeholder="e.g. Hiscox, PolicyBee"
											bind:value={pliProvider}
											required
										/>
									</div>
									<div>
										<label for="pliPolicyNumber" class="label block text-sm font-medium text-gray-700 mb-1">
											Policy Number <span class="text-error">*</span>
										</label>
										<input
											type="text"
											id="pliPolicyNumber"
											name="pliPolicyNumber"
											class="input w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
											placeholder="e.g. PLI-2025-12345"
											bind:value={pliPolicyNumber}
											required
										/>
									</div>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label for="pliExpiryDate" class="label block text-sm font-medium text-gray-700 mb-1">
											Expiry Date <span class="text-error">*</span>
										</label>
										<input
											type="date"
											id="pliExpiryDate"
											name="pliExpiryDate"
											class="input w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
											bind:value={pliExpiryDate}
											required
										/>
									</div>
									<div>
										<label for="pliDocumentUrl" class="label block text-sm font-medium text-gray-700 mb-1">
											Document URL <span class="text-gray-400 text-xs font-normal">(optional)</span>
										</label>
										<input
											type="url"
											id="pliDocumentUrl"
											name="pliDocumentUrl"
											class="input w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
											placeholder="https://..."
											bind:value={pliDocumentUrl}
										/>
									</div>
								</div>

								<button
									type="submit"
									class="btn-primary inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={isSubmittingPLI || !pliProvider || !pliPolicyNumber || !pliExpiryDate}
								>
									{#if isSubmittingPLI}
										<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
										</svg>
										Updating...
									{:else}
										Update Insurance Details
									{/if}
								</button>
							</div>
						</form>
					</div>

					<!-- Remove PLI -->
					<div class="mt-4 pt-4 border-t border-gray-100">
						{#if showRemoveConfirm}
							<div class="p-4 bg-error/5 rounded-lg border border-error/20">
								<p class="text-sm font-medium text-gray-900 mb-2">Remove insurance details?</p>
								<p class="text-sm text-gray-600 mb-4">
									{#if !hasEquity}
										This will downgrade your profile to Community Member and you will no longer be visible to clients for booking.
									{:else}
										Your insurance details will be removed, but you will retain Verified Pro status through your Equity membership.
									{/if}
								</p>
								<div class="flex items-center gap-3">
									<form
										method="POST"
										action="?/removePLI"
										use:enhance={() => {
											isRemovingPLI = true;
											return async ({ update }) => {
												isRemovingPLI = false;
												showRemoveConfirm = false;
												await update();
											};
										}}
									>
										<button
											type="submit"
											class="inline-flex items-center gap-2 px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-error/90 transition-colors disabled:opacity-50"
											disabled={isRemovingPLI}
										>
											{#if isRemovingPLI}
												<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
													<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
													<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
												</svg>
												Removing...
											{:else}
												Yes, Remove Insurance
											{/if}
										</button>
									</form>
									<button
										type="button"
										class="btn-outline px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
										onclick={() => (showRemoveConfirm = false)}
									>
										Cancel
									</button>
								</div>
							</div>
						{:else}
							<button
								type="button"
								class="text-sm text-error hover:text-error/80 font-medium transition-colors"
								onclick={() => (showRemoveConfirm = true)}
							>
								Remove insurance details
							</button>
						{/if}
					</div>
				{:else}
					<!-- No PLI yet - show form -->
					<div class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
						<div class="flex gap-3">
							<svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<div>
								<p class="text-sm font-medium text-blue-900">About Public Liability Insurance</p>
								<p class="text-sm text-blue-700 mt-1">
									Upload your PLI details to become visible to clients for booking.
									All performers on IgniteGigs must have valid public liability insurance
									(minimum &pound;5 million cover recommended) to accept bookings.
								</p>
							</div>
						</div>
					</div>

					<form
						method="POST"
						action="?/submitPLI"
						use:enhance={() => {
							isSubmittingPLI = true;
							return async ({ update }) => {
								isSubmittingPLI = false;
								await update();
							};
						}}
					>
						<div class="space-y-4">
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label for="pliProviderNew" class="label block text-sm font-medium text-gray-700 mb-1">
										Insurance Provider <span class="text-error">*</span>
									</label>
									<input
										type="text"
										id="pliProviderNew"
										name="pliProvider"
										class="input w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
										placeholder="e.g. Hiscox, PolicyBee, Insure4Sport"
										bind:value={pliProvider}
										required
									/>
								</div>
								<div>
									<label for="pliPolicyNumberNew" class="label block text-sm font-medium text-gray-700 mb-1">
										Policy Number <span class="text-error">*</span>
									</label>
									<input
										type="text"
										id="pliPolicyNumberNew"
										name="pliPolicyNumber"
										class="input w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
										placeholder="e.g. PLI-2025-12345"
										bind:value={pliPolicyNumber}
										required
									/>
								</div>
							</div>

							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label for="pliExpiryDateNew" class="label block text-sm font-medium text-gray-700 mb-1">
										Expiry Date <span class="text-error">*</span>
									</label>
									<input
										type="date"
										id="pliExpiryDateNew"
										name="pliExpiryDate"
										class="input w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
										bind:value={pliExpiryDate}
										required
									/>
								</div>
								<div>
									<label for="pliDocumentUrlNew" class="label block text-sm font-medium text-gray-700 mb-1">
										Document URL <span class="text-gray-400 text-xs font-normal">(optional)</span>
									</label>
									<input
										type="url"
										id="pliDocumentUrlNew"
										name="pliDocumentUrl"
										class="input w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
										placeholder="https://..."
										bind:value={pliDocumentUrl}
									/>
									<p class="text-xs text-gray-400 mt-1">Link to a scan or PDF of your insurance certificate.</p>
								</div>
							</div>

							<button
								type="submit"
								class="btn-primary inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={isSubmittingPLI || !pliProvider || !pliPolicyNumber || !pliExpiryDate}
							>
								{#if isSubmittingPLI}
									<svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
									</svg>
									Submitting...
								{:else}
									Submit Insurance Details
								{/if}
							</button>
						</div>
					</form>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Back to Dashboard -->
	<div class="pt-2">
		<a
			href="/dashboard"
			class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
			Back to Dashboard
		</a>
	</div>
</div>
