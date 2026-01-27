<script lang="ts">
	let activeTab = $state<'performers' | 'clients' | 'community'>('performers');
</script>

<svelte:head>
	<title>Trust & Safety - IgniteGigs</title>
	<meta
		name="description"
		content="Learn how IgniteGigs protects performers and clients with verified profiles, insurance documentation, secure payments, and our community vouching system."
	/>
	<meta property="og:title" content="Trust & Safety - IgniteGigs" />
	<meta
		property="og:description"
		content="A performer-owned platform built on trust, transparency, and community support. Learn about our verification, insurance, and payment protection."
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Trust & Safety - IgniteGigs" />
	<meta
		name="twitter:description"
		content="Verified performers, secure payments, and community-backed trust. See how IgniteGigs keeps everyone safe."
	/>
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-secondary via-secondary to-gray-900 text-white">
	<div class="container-wide py-16 md:py-24">
		<div class="max-w-3xl">
			<div class="flex items-center gap-3 mb-6">
				<div class="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
					<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
						/>
					</svg>
				</div>
				<span class="text-primary font-semibold text-sm uppercase tracking-wide">Trust & Safety</span>
			</div>
			<h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
				Built on Trust,
				<span class="text-primary">Powered by Community.</span>
			</h1>
			<p class="text-lg md:text-xl text-gray-300 mb-8">
				Fire and LED performance is safety-critical work. That's why we've built IgniteGigs with
				verification, insurance checks, secure payments, and a community vouching system that keeps
				everyone protected.
			</p>

			<!-- Trust Stats -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
				<div>
					<p class="text-3xl font-bold text-primary">100%</p>
					<p class="text-sm text-gray-400">Verified Performers</p>
				</div>
				<div>
					<p class="text-3xl font-bold text-primary">500+</p>
					<p class="text-sm text-gray-400">Insured Artists</p>
				</div>
				<div>
					<p class="text-3xl font-bold text-primary">25%</p>
					<p class="text-sm text-gray-400">Deposit Protection</p>
				</div>
				<div>
					<p class="text-3xl font-bold text-primary">3</p>
					<p class="text-sm text-gray-400">Vouches for Trust Badge</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Tab Navigation -->
<section class="bg-white border-b border-gray-200 sticky top-0 z-30">
	<div class="container-wide">
		<div class="flex gap-1 overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
			<button
				class="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all {activeTab === 'performers'
					? 'bg-primary text-white'
					: 'text-gray-600 hover:bg-gray-100'}"
				onclick={() => (activeTab = 'performers')}
			>
				<span class="flex items-center gap-2">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						/>
					</svg>
					For Performers
				</span>
			</button>
			<button
				class="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all {activeTab === 'clients'
					? 'bg-primary text-white'
					: 'text-gray-600 hover:bg-gray-100'}"
				onclick={() => (activeTab = 'clients')}
			>
				<span class="flex items-center gap-2">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
						/>
					</svg>
					For Clients
				</span>
			</button>
			<button
				class="px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all {activeTab === 'community'
					? 'bg-primary text-white'
					: 'text-gray-600 hover:bg-gray-100'}"
				onclick={() => (activeTab = 'community')}
			>
				<span class="flex items-center gap-2">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
						/>
					</svg>
					Community Trust
				</span>
			</button>
		</div>
	</div>
</section>

<!-- FOR PERFORMERS TAB -->
{#if activeTab === 'performers'}
	<section class="py-16 md:py-24 bg-gray-50">
		<div class="container-wide">
			<div class="text-center mb-12">
				<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
					Protecting You at Every Step
				</h2>
				<p class="text-xl text-gray-600 max-w-2xl mx-auto">
					From verification to payment, we've built systems that protect your business and reputation.
				</p>
			</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				<!-- Profile Verification -->
				<div class="bg-white rounded-card shadow-card p-8">
					<div class="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center mb-6">
						<svg class="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h3 class="font-display text-xl font-semibold text-secondary mb-3">Profile Verification</h3>
					<p class="text-gray-600 mb-4">
						Get verified to stand out from the crowd and build client confidence.
					</p>
					<div class="space-y-3">
						<div class="flex items-start gap-3">
							<span class="text-success mt-0.5">1.</span>
							<span class="text-gray-600 text-sm">Submit ID verification (secure & confidential)</span>
						</div>
						<div class="flex items-start gap-3">
							<span class="text-success mt-0.5">2.</span>
							<span class="text-gray-600 text-sm">Provide performance video/photos</span>
						</div>
						<div class="flex items-start gap-3">
							<span class="text-success mt-0.5">3.</span>
							<span class="text-gray-600 text-sm">Link social media profiles for authenticity</span>
						</div>
						<div class="flex items-start gap-3">
							<span class="text-success mt-0.5">4.</span>
							<span class="text-gray-600 text-sm">Receive your verified badge within 24 hours</span>
						</div>
					</div>
				</div>

				<!-- Insurance Requirements -->
				<div class="bg-white rounded-card shadow-card p-8">
					<div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
						<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
					<h3 class="font-display text-xl font-semibold text-secondary mb-3">Insurance Verification</h3>
					<p class="text-gray-600 mb-4">
						Fire performance requires proper coverage. We verify and display your insurance status.
					</p>
					<ul class="space-y-2">
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-success">&#10003;</span>
							Public liability insurance required
						</li>
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-success">&#10003;</span>
							Policy documents securely stored
						</li>
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-success">&#10003;</span>
							Expiry reminders sent automatically
						</li>
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-success">&#10003;</span>
							Insurance badge visible to clients
						</li>
					</ul>
				</div>

				<!-- Community Vouching -->
				<div class="bg-white rounded-card shadow-card p-8">
					<div class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
						<svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
							/>
						</svg>
					</div>
					<h3 class="font-display text-xl font-semibold text-secondary mb-3">Community Vouching</h3>
					<p class="text-gray-600 mb-4">
						New to the platform? Get vouched by experienced performers who know your work.
					</p>
					<ul class="space-y-2">
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-purple-600">&#10003;</span>
							3 vouches = Trusted Performer badge
						</li>
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-purple-600">&#10003;</span>
							Only verified performers can vouch
						</li>
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-purple-600">&#10003;</span>
							Vouch for performers you've worked with
						</li>
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-purple-600">&#10003;</span>
							Build reputation through community
						</li>
					</ul>
				</div>

				<!-- Secure Payments -->
				<div class="bg-white rounded-card shadow-card p-8">
					<div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
						<svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</div>
					<h3 class="font-display text-xl font-semibold text-secondary mb-3">Secure Payment Protection</h3>
					<p class="text-gray-600 mb-4">
						Get paid reliably with Stripe-powered payments and deposit protection.
					</p>
					<ul class="space-y-2">
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-green-600">&#10003;</span>
							25% deposit secured at booking
						</li>
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-green-600">&#10003;</span>
							Remaining 75% after event completion
						</li>
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-green-600">&#10003;</span>
							Payouts in 2-3 business days
						</li>
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-green-600">&#10003;</span>
							Cancellation protection policy
						</li>
					</ul>
				</div>

				<!-- Dispute Resolution -->
				<div class="bg-white rounded-card shadow-card p-8">
					<div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
						<svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
							/>
						</svg>
					</div>
					<h3 class="font-display text-xl font-semibold text-secondary mb-3">Fair Dispute Resolution</h3>
					<p class="text-gray-600 mb-4">
						Issues happen rarely, but when they do, we have a fair process to protect both parties.
					</p>
					<ul class="space-y-2">
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-blue-600">&#10003;</span>
							48-hour response from support team
						</li>
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-blue-600">&#10003;</span>
							Evidence-based review process
						</li>
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-blue-600">&#10003;</span>
							Mediation before escalation
						</li>
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-blue-600">&#10003;</span>
							Performer advocate on staff
						</li>
					</ul>
				</div>

				<!-- Reviews & Reputation -->
				<div class="bg-white rounded-card shadow-card p-8">
					<div class="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
						<svg class="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
							/>
						</svg>
					</div>
					<h3 class="font-display text-xl font-semibold text-secondary mb-3">Verified Reviews Only</h3>
					<p class="text-gray-600 mb-4">
						Your reputation is protected by our verified booking review system.
					</p>
					<ul class="space-y-2">
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-yellow-600">&#10003;</span>
							Only completed bookings can review
						</li>
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-yellow-600">&#10003;</span>
							Respond publicly to any review
						</li>
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-yellow-600">&#10003;</span>
							Flag fraudulent reviews for removal
						</li>
						<li class="flex items-center gap-2 text-sm text-gray-600">
							<span class="text-yellow-600">&#10003;</span>
							Reviews tied to real identities
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>
{/if}

<!-- FOR CLIENTS TAB -->
{#if activeTab === 'clients'}
	<section class="py-16 md:py-24 bg-gray-50">
		<div class="container-wide">
			<div class="text-center mb-12">
				<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
					Book with Confidence
				</h2>
				<p class="text-xl text-gray-600 max-w-2xl mx-auto">
					Every performer is verified, insured, and backed by our community. Your event is in safe hands.
				</p>
			</div>

			<!-- Trust Badges Visual -->
			<div class="bg-white rounded-card shadow-card p-8 mb-12 max-w-4xl mx-auto">
				<h3 class="font-display text-lg font-semibold text-secondary mb-6 text-center">
					What Our Trust Badges Mean
				</h3>
				<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<div class="text-center">
						<div class="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
							<svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<p class="font-semibold text-secondary">Verified</p>
						<p class="text-sm text-gray-500">ID confirmed</p>
					</div>
					<div class="text-center">
						<div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
							<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								/>
							</svg>
						</div>
						<p class="font-semibold text-secondary">Insured</p>
						<p class="text-sm text-gray-500">Public liability active</p>
					</div>
					<div class="text-center">
						<div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
							<svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</div>
						<p class="font-semibold text-secondary">Trusted</p>
						<p class="text-sm text-gray-500">3+ peer vouches</p>
					</div>
					<div class="text-center">
						<div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
							<svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
								/>
							</svg>
						</div>
						<p class="font-semibold text-secondary">Top Rated</p>
						<p class="text-sm text-gray-500">4.8+ stars</p>
					</div>
				</div>
			</div>

			<div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
				<!-- Verification -->
				<div class="bg-white rounded-card shadow-card p-8">
					<div class="flex items-start gap-4 mb-6">
						<div class="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="font-display text-xl font-semibold text-secondary mb-2">All Performers Verified</h3>
							<p class="text-gray-600">
								Every performer completes identity verification before they can accept bookings. You know who you're hiring.
							</p>
						</div>
					</div>
				</div>

				<!-- Insurance -->
				<div class="bg-white rounded-card shadow-card p-8">
					<div class="flex items-start gap-4 mb-6">
						<div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="font-display text-xl font-semibold text-secondary mb-2">Insurance Documentation</h3>
							<p class="text-gray-600">
								Fire and LED performers must have valid public liability insurance. Request certificates directly through the platform.
							</p>
						</div>
					</div>
				</div>

				<!-- Secure Payments -->
				<div class="bg-white rounded-card shadow-card p-8">
					<div class="flex items-start gap-4 mb-6">
						<div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="font-display text-xl font-semibold text-secondary mb-2">Secure Stripe Payments</h3>
							<p class="text-gray-600">
								All payments processed through Stripe with bank-level encryption. Your card details are never stored on our servers.
							</p>
						</div>
					</div>
				</div>

				<!-- Deposit Protection -->
				<div class="bg-white rounded-card shadow-card p-8">
					<div class="flex items-start gap-4 mb-6">
						<div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="font-display text-xl font-semibold text-secondary mb-2">25% Deposit Protection</h3>
							<p class="text-gray-600">
								Pay just 25% upfront to secure your booking. The deposit is held securely until event completion.
							</p>
						</div>
					</div>
				</div>

				<!-- Verified Reviews -->
				<div class="bg-white rounded-card shadow-card p-8">
					<div class="flex items-start gap-4 mb-6">
						<div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="font-display text-xl font-semibold text-secondary mb-2">Verified Booking Reviews</h3>
							<p class="text-gray-600">
								Only clients with completed bookings can leave reviews. No fake reviews, only genuine experiences.
							</p>
						</div>
					</div>
				</div>

				<!-- Report Issues -->
				<div class="bg-white rounded-card shadow-card p-8">
					<div class="flex items-start gap-4 mb-6">
						<div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
							<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>
						<div>
							<h3 class="font-display text-xl font-semibold text-secondary mb-2">Report Any Issues</h3>
							<p class="text-gray-600">
								Problems with a booking? Our support team responds within 48 hours with fair mediation for both parties.
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- How to Report -->
			<div class="mt-12 max-w-3xl mx-auto">
				<div class="bg-secondary text-white rounded-card p-8">
					<h3 class="font-display text-xl font-semibold mb-4">How to Report an Issue</h3>
					<div class="grid sm:grid-cols-3 gap-6">
						<div class="text-center">
							<div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
								<span class="font-bold">1</span>
							</div>
							<p class="text-sm text-gray-300">Go to your booking in the dashboard</p>
						</div>
						<div class="text-center">
							<div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
								<span class="font-bold">2</span>
							</div>
							<p class="text-sm text-gray-300">Click "Report Issue" and describe the problem</p>
						</div>
						<div class="text-center">
							<div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
								<span class="font-bold">3</span>
							</div>
							<p class="text-sm text-gray-300">Our team will review and respond within 48 hours</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}

<!-- COMMUNITY TRUST TAB -->
{#if activeTab === 'community'}
	<section class="py-16 md:py-24 bg-gray-50">
		<div class="container-wide">
			<div class="text-center mb-12">
				<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
					Community-Powered Trust
				</h2>
				<p class="text-xl text-gray-600 max-w-2xl mx-auto">
					IgniteGigs is performer-owned. Our vouching system builds trust through real relationships, not just algorithms.
				</p>
			</div>

			<!-- Vouching System Explained -->
			<div class="bg-white rounded-card shadow-card p-8 mb-12 max-w-4xl mx-auto">
				<div class="text-center mb-8">
					<div class="w-20 h-20 bg-gradient-to-br from-primary to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</div>
					<h3 class="font-display text-2xl font-bold text-secondary mb-2">The Vouching System</h3>
					<p class="text-gray-600">How performers vouch for each other</p>
				</div>

				<!-- Process Diagram -->
				<div class="relative">
					<!-- Connection Line (hidden on mobile) -->
					<div class="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gray-200"></div>

					<div class="grid md:grid-cols-4 gap-8">
						<div class="relative text-center">
							<div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
								<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
									/>
								</svg>
							</div>
							<h4 class="font-semibold text-secondary mb-1">New Performer</h4>
							<p class="text-sm text-gray-500">Joins and creates profile</p>
						</div>

						<div class="relative text-center">
							<div class="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
								<svg class="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
									/>
								</svg>
							</div>
							<h4 class="font-semibold text-secondary mb-1">Requests Vouches</h4>
							<p class="text-sm text-gray-500">From performers they know</p>
						</div>

						<div class="relative text-center">
							<div class="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
								<svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h4 class="font-semibold text-secondary mb-1">3 Vouches Received</h4>
							<p class="text-sm text-gray-500">Verified performers confirm</p>
						</div>

						<div class="relative text-center">
							<div class="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 ring-4 ring-success/30">
								<svg class="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
									/>
								</svg>
							</div>
							<h4 class="font-semibold text-success mb-1">Trusted Badge</h4>
							<p class="text-sm text-gray-500">Community endorsed</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Community Values -->
			<div class="grid md:grid-cols-3 gap-8 mb-12">
				<div class="bg-white rounded-card shadow-card p-8 text-center">
					<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
						<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
							/>
						</svg>
					</div>
					<h3 class="font-display text-xl font-semibold text-secondary mb-3">Mentorship Network</h3>
					<p class="text-gray-600">
						Experienced performers guide newcomers. Share knowledge about safety, technique, and business skills.
					</p>
				</div>

				<div class="bg-white rounded-card shadow-card p-8 text-center">
					<div class="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
						<svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h3 class="font-display text-xl font-semibold text-secondary mb-3">Community-Owned</h3>
					<p class="text-gray-600">
						Built by performers, for performers. Decisions are made with community input, not just shareholders.
					</p>
				</div>

				<div class="bg-white rounded-card shadow-card p-8 text-center">
					<div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
						<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
					<h3 class="font-display text-xl font-semibold text-secondary mb-3">Equal Support</h3>
					<p class="text-gray-600">
						Every performer gets the same platform features. No pay-to-play rankings or hidden boosts.
					</p>
				</div>
			</div>

			<!-- Transparency Section -->
			<div class="bg-gradient-to-br from-secondary via-secondary to-gray-900 rounded-card p-8 md:p-12 text-white max-w-4xl mx-auto">
				<div class="text-center mb-8">
					<h3 class="font-display text-2xl font-bold mb-3">Building Trust Through Transparency</h3>
					<p class="text-gray-300">
						We believe trust comes from openness. Here's how we operate.
					</p>
				</div>
				<div class="grid sm:grid-cols-2 gap-6">
					<div class="flex items-start gap-4">
						<div class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<h4 class="font-semibold mb-1">Clear Pricing</h4>
							<p class="text-sm text-gray-300">8% platform fee, no hidden costs. Performers keep 92% of every booking.</p>
						</div>
					</div>
					<div class="flex items-start gap-4">
						<div class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
							</svg>
						</div>
						<div>
							<h4 class="font-semibold mb-1">Open Rankings</h4>
							<p class="text-sm text-gray-300">Search results based on relevance and ratings, not who pays more.</p>
						</div>
					</div>
					<div class="flex items-start gap-4">
						<div class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
							</svg>
						</div>
						<div>
							<h4 class="font-semibold mb-1">Community Input</h4>
							<p class="text-sm text-gray-300">Feature requests and policy changes involve performer feedback.</p>
						</div>
					</div>
					<div class="flex items-start gap-4">
						<div class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
							<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
							</svg>
						</div>
						<div>
							<h4 class="font-semibold mb-1">Data Ownership</h4>
							<p class="text-sm text-gray-300">Your client relationships and performance data belong to you.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}

<!-- CTA Section -->
<section class="py-16 md:py-24">
	<div class="container-wide">
		<div class="bg-gradient-fire rounded-3xl p-8 md:p-16 text-center text-white">
			<h2 class="font-display text-3xl md:text-4xl font-bold mb-4">
				Ready to Join a Trusted Community?
			</h2>
			<p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
				Whether you're a performer looking for better opportunities or a client seeking verified talent, IgniteGigs has you covered.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a
					href="/auth/signup?type=performer"
					class="btn-lg bg-white text-primary hover:bg-gray-100 font-semibold px-8"
				>
					Join as Performer
				</a>
				<a
					href="/performers"
					class="btn-lg bg-white/10 text-white hover:bg-white/20 font-semibold px-8 border border-white/30"
				>
					Browse Performers
				</a>
			</div>
		</div>
	</div>
</section>

<!-- FAQ Section -->
<section class="py-16 md:py-24 bg-gray-50">
	<div class="container-wide">
		<div class="max-w-3xl mx-auto">
			<div class="text-center mb-12">
				<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
					Frequently Asked Questions
				</h2>
			</div>

			<div class="space-y-4">
				<details class="bg-white rounded-card shadow-card group">
					<summary class="p-6 cursor-pointer font-semibold text-secondary flex items-center justify-between">
						How does the vouching system work?
						<svg class="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</summary>
					<div class="px-6 pb-6 text-gray-600">
						New performers can request vouches from verified performers who know their work. Once you receive 3 vouches from established community members, you earn the "Trusted Performer" badge. Only verified performers with at least 5 completed bookings can give vouches, ensuring the system maintains its integrity.
					</div>
				</details>

				<details class="bg-white rounded-card shadow-card group">
					<summary class="p-6 cursor-pointer font-semibold text-secondary flex items-center justify-between">
						What insurance do performers need?
						<svg class="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</summary>
					<div class="px-6 pb-6 text-gray-600">
						All fire and LED performers must have valid public liability insurance (minimum 5 million cover recommended for fire performers). You'll upload your certificate during profile setup, and we'll remind you before it expires. Clients can request to see your insurance documentation through the platform.
					</div>
				</details>

				<details class="bg-white rounded-card shadow-card group">
					<summary class="p-6 cursor-pointer font-semibold text-secondary flex items-center justify-between">
						How are payments protected?
						<svg class="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</summary>
					<div class="px-6 pb-6 text-gray-600">
						Clients pay a 25% deposit when booking, which is held securely by Stripe. The remaining 75% is paid after event completion. Performers receive payouts within 2-3 business days. If a client cancels within our cancellation window, the deposit is released to the performer. If a performer cancels, the client receives a full refund.
					</div>
				</details>

				<details class="bg-white rounded-card shadow-card group">
					<summary class="p-6 cursor-pointer font-semibold text-secondary flex items-center justify-between">
						What if there's a dispute?
						<svg class="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</summary>
					<div class="px-6 pb-6 text-gray-600">
						Our dispute resolution process is designed to be fair to both parties. Either side can raise an issue through their booking dashboard. Our support team reviews evidence from both parties, attempts mediation, and makes a final decision within 5 business days. We have a performer advocate on staff to ensure performer voices are heard.
					</div>
				</details>

				<details class="bg-white rounded-card shadow-card group">
					<summary class="p-6 cursor-pointer font-semibold text-secondary flex items-center justify-between">
						Can I leave a review for any performer?
						<svg class="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</summary>
					<div class="px-6 pb-6 text-gray-600">
						No, only clients with completed bookings can leave reviews. This prevents fake reviews and ensures all feedback comes from genuine experiences. Reviews are tied to real bookings and identities, creating a trustworthy reputation system for performers.
					</div>
				</details>
			</div>
		</div>
	</div>
</section>
