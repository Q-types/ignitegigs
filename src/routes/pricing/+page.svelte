<script lang="ts">
	// Calculator state
	let annualBookings = $state(20000);

	// Calculated values
	let agencyCut = $derived(annualBookings * 0.425); // Average 42.5% agency fee
	let igniteCut = $derived(annualBookings * 0.08);
	let yearlySavings = $derived(agencyCut - igniteCut);
	let performerKeepsAgency = $derived(annualBookings - agencyCut);
	let performerKeepsIgnite = $derived(annualBookings - igniteCut);

	// Format currency
	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(value);
	}
</script>

<svelte:head>
	<title>Pricing - IgniteGigs | Only 8% Platform Fee</title>
	<meta name="description" content="Simple, fair pricing for performers. Only 8% platform fee when you book. No monthly fees, no signup fees. Keep 92% of every gig on IgniteGigs." />
	<meta property="og:title" content="Pricing - IgniteGigs | Only 8% Platform Fee" />
	<meta property="og:description" content="Simple, fair pricing for performers. Only 8% platform fee when you book. No monthly fees, no signup fees." />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Pricing - IgniteGigs | Only 8% Platform Fee" />
	<meta name="twitter:description" content="Simple, fair pricing for performers. Only 8% platform fee when you book. No monthly fees, no signup fees." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-secondary via-secondary to-gray-900 text-white">
	<div class="container-wide py-16 md:py-24">
		<div class="max-w-3xl mx-auto text-center">
			<h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
				Simple, Fair <span class="text-primary">Pricing</span>
			</h1>
			<p class="text-xl md:text-2xl text-gray-300">
				Only pay when you book. No hidden fees.
			</p>
		</div>
	</div>
</section>

<!-- Main Pricing Section -->
<section class="py-16 md:py-24 bg-gray-50">
	<div class="container-wide">
		<div class="max-w-4xl mx-auto">
			<!-- Big 8% Visual -->
			<div class="bg-white rounded-3xl p-8 md:p-16 text-center shadow-xl border-2 border-primary mb-12">
				<p class="text-gray-500 text-lg mb-4">Platform Fee</p>
				<div class="flex items-center justify-center gap-2 mb-4">
					<span class="font-display text-7xl md:text-9xl font-bold text-primary">8</span>
					<span class="font-display text-5xl md:text-7xl font-bold text-primary">%</span>
				</div>
				<p class="text-2xl md:text-3xl font-display font-bold text-secondary mb-6">
					That's it.
				</p>
				<p class="text-lg text-gray-600 mb-8">
					No monthly fees. No signup fees. No hidden charges.
				</p>

				<!-- Example Breakdown -->
				<div class="bg-gray-50 rounded-2xl p-6 md:p-8 max-w-md mx-auto">
					<p class="text-sm text-gray-500 uppercase tracking-wide mb-4">Example Booking</p>
					<div class="space-y-3">
						<div class="flex justify-between items-center text-lg">
							<span class="text-gray-600">Client pays</span>
							<span class="font-semibold text-secondary">£500</span>
						</div>
						<div class="flex justify-between items-center text-lg">
							<span class="text-gray-600">Platform fee (8%)</span>
							<span class="font-semibold text-gray-500">-£40</span>
						</div>
						<div class="border-t border-gray-200 pt-3 mt-3">
							<div class="flex justify-between items-center text-xl">
								<span class="font-semibold text-secondary">You receive</span>
								<span class="font-bold text-success text-2xl">£460</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Comparison Section -->
			<div class="text-center mb-12">
				<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
					Compare with agencies
				</h2>
				<p class="text-xl text-gray-600">
					See why performers are switching to IgniteGigs
				</p>
			</div>

			<!-- Comparison Table -->
			<div class="grid md:grid-cols-2 gap-8 mb-16">
				<!-- Agency Column -->
				<div class="bg-white rounded-xl p-8 border-2 border-gray-200">
					<div class="text-center mb-8">
						<span class="inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mb-4">
							Traditional Agency
						</span>
						<p class="text-4xl font-bold text-gray-400 mb-2">35-50%</p>
						<p class="text-gray-500">commission taken</p>
					</div>
					<ul class="space-y-4">
						<li class="flex items-start gap-3">
							<span class="text-error mt-1">✗</span>
							<span class="text-gray-600">High commission (35-50%)</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-error mt-1">✗</span>
							<span class="text-gray-600">Hidden admin fees</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-error mt-1">✗</span>
							<span class="text-gray-600">Slow payments (30-60 days)</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-error mt-1">✗</span>
							<span class="text-gray-600">No direct client contact</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-error mt-1">✗</span>
							<span class="text-gray-600">Agency controls your rates</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-error mt-1">✗</span>
							<span class="text-gray-600">Limited profile customization</span>
						</li>
					</ul>
				</div>

				<!-- IgniteGigs Column -->
				<div class="bg-white rounded-xl p-8 border-2 border-primary shadow-lg relative">
					<div class="absolute -top-3 left-1/2 -translate-x-1/2">
						<span class="inline-block px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold">
							Recommended
						</span>
					</div>
					<div class="text-center mb-8 mt-2">
						<span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
							IgniteGigs
						</span>
						<p class="text-4xl font-bold text-primary mb-2">8%</p>
						<p class="text-gray-500">platform fee only</p>
					</div>
					<ul class="space-y-4">
						<li class="flex items-start gap-3">
							<span class="text-success mt-1">✓</span>
							<span class="text-gray-600">Just 8% platform fee</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-success mt-1">✓</span>
							<span class="text-gray-600">100% transparent pricing</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-success mt-1">✓</span>
							<span class="text-gray-600">Fast payouts (2-3 days)</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-success mt-1">✓</span>
							<span class="text-gray-600">Direct client messaging</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-success mt-1">✓</span>
							<span class="text-gray-600">You set your own rates</span>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-success mt-1">✓</span>
							<span class="text-gray-600">Full video portfolio</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Calculator Section -->
<section class="py-16 md:py-24 bg-secondary text-white">
	<div class="container-wide">
		<div class="max-w-4xl mx-auto">
			<div class="text-center mb-12">
				<h2 class="font-display text-3xl md:text-4xl font-bold mb-4">
					Calculate Your Savings
				</h2>
				<p class="text-xl text-gray-400">
					See how much more you could earn with IgniteGigs
				</p>
			</div>

			<div class="bg-secondary-light rounded-3xl p-8 md:p-12">
				<!-- Input -->
				<div class="mb-10">
					<label for="annual-bookings" class="block text-lg font-medium text-gray-300 mb-4 text-center">
						Your annual bookings value
					</label>
					<div class="flex items-center justify-center gap-4">
						<span class="text-2xl text-gray-400">£</span>
						<input
							type="range"
							id="annual-bookings"
							bind:value={annualBookings}
							min="5000"
							max="100000"
							step="1000"
							class="w-full max-w-md h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary"
						/>
						<span class="text-2xl font-bold text-primary min-w-[120px] text-right">
							{formatCurrency(annualBookings)}
						</span>
					</div>
				</div>

				<!-- Results Grid -->
				<div class="grid md:grid-cols-3 gap-6">
					<!-- Agency Result -->
					<div class="bg-gray-800/50 rounded-2xl p-6 text-center">
						<p class="text-sm text-gray-400 uppercase tracking-wide mb-2">With Agency</p>
						<p class="text-sm text-gray-500 mb-4">(42.5% avg. fee)</p>
						<p class="text-lg text-gray-400 mb-1">You keep</p>
						<p class="text-3xl font-bold text-gray-300">{formatCurrency(performerKeepsAgency)}</p>
						<p class="text-sm text-gray-500 mt-2">Agency takes {formatCurrency(agencyCut)}</p>
					</div>

					<!-- IgniteGigs Result -->
					<div class="bg-primary/20 rounded-2xl p-6 text-center border-2 border-primary">
						<p class="text-sm text-primary uppercase tracking-wide mb-2">With IgniteGigs</p>
						<p class="text-sm text-gray-400 mb-4">(8% fee)</p>
						<p class="text-lg text-gray-300 mb-1">You keep</p>
						<p class="text-3xl font-bold text-success">{formatCurrency(performerKeepsIgnite)}</p>
						<p class="text-sm text-gray-400 mt-2">Platform fee {formatCurrency(igniteCut)}</p>
					</div>

					<!-- Savings -->
					<div class="bg-success/20 rounded-2xl p-6 text-center border-2 border-success">
						<p class="text-sm text-success uppercase tracking-wide mb-2">Your Savings</p>
						<p class="text-sm text-gray-400 mb-4">Per Year</p>
						<p class="text-lg text-gray-300 mb-1">Extra income</p>
						<p class="text-4xl font-bold text-success">{formatCurrency(yearlySavings)}</p>
						<p class="text-sm text-gray-400 mt-2">in your pocket</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- What's Included Section -->
<section class="py-16 md:py-24">
	<div class="container-wide">
		<div class="text-center mb-12">
			<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
				Everything Included
			</h2>
			<p class="text-xl text-gray-600">
				All these features at no extra cost
			</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
			<!-- Feature 1 -->
			<div class="bg-white rounded-xl p-6 shadow-card text-center">
				<div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
				</div>
				<h3 class="font-display text-lg font-semibold mb-2">Profile Hosting</h3>
				<p class="text-gray-600 text-sm">
					Your professional profile page with custom bio and act details
				</p>
			</div>

			<!-- Feature 2 -->
			<div class="bg-white rounded-xl p-6 shadow-card text-center">
				<div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
					</svg>
				</div>
				<h3 class="font-display text-lg font-semibold mb-2">Video Uploads</h3>
				<p class="text-gray-600 text-sm">
					Showcase your best work with HD video reels via Cloudinary
				</p>
			</div>

			<!-- Feature 3 -->
			<div class="bg-white rounded-xl p-6 shadow-card text-center">
				<div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
				</div>
				<h3 class="font-display text-lg font-semibold mb-2">Booking Management</h3>
				<p class="text-gray-600 text-sm">
					Calendar, availability, and booking requests in one dashboard
				</p>
			</div>

			<!-- Feature 4 -->
			<div class="bg-white rounded-xl p-6 shadow-card text-center">
				<div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
					</svg>
				</div>
				<h3 class="font-display text-lg font-semibold mb-2">Secure Payments</h3>
				<p class="text-gray-600 text-sm">
					Stripe-powered payments with deposit protection
				</p>
			</div>

			<!-- Feature 5 -->
			<div class="bg-white rounded-xl p-6 shadow-card text-center">
				<div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
					</svg>
				</div>
				<h3 class="font-display text-lg font-semibold mb-2">Messaging System</h3>
				<p class="text-gray-600 text-sm">
					Direct chat with clients to discuss event details
				</p>
			</div>

			<!-- Feature 6 -->
			<div class="bg-white rounded-xl p-6 shadow-card text-center">
				<div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
					</svg>
				</div>
				<h3 class="font-display text-lg font-semibold mb-2">Review System</h3>
				<p class="text-gray-600 text-sm">
					Build your reputation with verified client reviews
				</p>
			</div>

			<!-- Feature 7 -->
			<div class="bg-white rounded-xl p-6 shadow-card text-center">
				<div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
				</div>
				<h3 class="font-display text-lg font-semibold mb-2">Community Vouching</h3>
				<p class="text-gray-600 text-sm">
					Get vouched by fellow performers to build trust
				</p>
			</div>

			<!-- Feature 8 -->
			<div class="bg-white rounded-xl p-6 shadow-card text-center">
				<div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
				</div>
				<h3 class="font-display text-lg font-semibold mb-2">Fast Payouts</h3>
				<p class="text-gray-600 text-sm">
					Get paid in 2-3 business days after the gig
				</p>
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
					Common Questions
				</h2>
			</div>

			<div class="space-y-6">
				<div class="bg-white rounded-xl p-6 shadow-card">
					<h3 class="font-display text-lg font-semibold text-secondary mb-2">
						When do I pay the 8% fee?
					</h3>
					<p class="text-gray-600">
						The fee is automatically deducted from each booking payment. You never have to manually pay anything - we simply transfer 92% of each booking to your account.
					</p>
				</div>

				<div class="bg-white rounded-xl p-6 shadow-card">
					<h3 class="font-display text-lg font-semibold text-secondary mb-2">
						Are there any other fees?
					</h3>
					<p class="text-gray-600">
						No. Just the 8% platform fee. No monthly subscription, no signup fees, no hidden charges. Stripe does charge their standard payment processing fee (around 1.5% + 20p), which is separate from our platform fee.
					</p>
				</div>

				<div class="bg-white rounded-xl p-6 shadow-card">
					<h3 class="font-display text-lg font-semibold text-secondary mb-2">
						How fast do I get paid?
					</h3>
					<p class="text-gray-600">
						After a completed gig, funds are released within 2-3 business days to your connected Stripe account. Much faster than the 30-60 day wait typical with agencies.
					</p>
				</div>

				<div class="bg-white rounded-xl p-6 shadow-card">
					<h3 class="font-display text-lg font-semibold text-secondary mb-2">
						What about cancellations?
					</h3>
					<p class="text-gray-600">
						Deposits are protected. If a client cancels within your cancellation window, you keep the deposit. Our system handles all the payment logistics automatically.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-16 md:py-24">
	<div class="container-wide">
		<div class="bg-gradient-fire rounded-3xl p-8 md:p-16 text-center text-white">
			<h2 class="font-display text-3xl md:text-4xl font-bold mb-4">
				Ready to keep more of what you earn?
			</h2>
			<p class="text-xl mb-8 opacity-90">
				Join free today. Only 8% when you book.
			</p>
			<a href="/auth/signup?type=performer" class="btn-lg bg-white text-primary hover:bg-gray-100 font-semibold px-8 inline-flex items-center gap-2">
				Join as Performer (Free)
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</a>
			<p class="mt-6 text-sm opacity-75">
				Takes less than 5 minutes to create your profile
			</p>
		</div>
	</div>
</section>
