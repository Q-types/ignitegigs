<script lang="ts">
	let searchLocation = $state('');
	let searchDate = $state('');
</script>

<svelte:head>
	<title>IgniteGigs - Book Fire & LED Performers Directly</title>
	<meta name="description" content="The performer-owned platform where entertainers keep 92% and clients skip the agency markup. Book fire performers and LED artists directly." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-secondary via-secondary to-gray-900 text-white">
	<div class="container-wide py-16 md:py-24">
		<div class="max-w-3xl">
			<h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
				Book Fire & LED Performers
				<span class="text-primary">Directly.</span>
			</h1>
			<p class="text-lg md:text-xl text-gray-300 mb-8">
				The performer-owned platform where entertainers keep 92% and clients skip the agency markup.
			</p>

			<!-- Search Box -->
			<div class="bg-white rounded-2xl p-4 shadow-xl">
				<form action="/performers" method="GET" class="flex flex-col md:flex-row gap-3">
					<div class="flex-1">
						<label for="location" class="sr-only">Location</label>
						<input
							type="text"
							id="location"
							name="location"
							bind:value={searchLocation}
							placeholder="Where's your event?"
							class="input-field w-full"
						/>
					</div>
					<div class="flex-1">
						<label for="date" class="sr-only">Date</label>
						<input
							type="date"
							id="date"
							name="date"
							bind:value={searchDate}
							class="input-field w-full"
						/>
					</div>
					<button type="submit" class="btn-primary btn-lg whitespace-nowrap">
						Find Performers
					</button>
				</form>
			</div>

			<!-- Trust Badges -->
			<div class="flex flex-wrap items-center gap-6 mt-8 text-sm text-gray-400">
				<div class="flex items-center gap-2">
					<span class="text-success">✓</span>
					<span>500+ verified performers</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="text-success">✓</span>
					<span>No agency fees</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="text-success">✓</span>
					<span>Secure payments</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Problem/Solution Section -->
<section class="py-16 md:py-24 bg-gray-50">
	<div class="container-wide">
		<div class="text-center mb-12">
			<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
				Agencies take 35-50% of every gig.
			</h2>
			<p class="text-xl text-gray-600">
				That's <span class="font-bold text-primary">£8,000/year</span> you're losing.
			</p>
		</div>

		<div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
			<!-- Agency Model -->
			<div class="bg-white rounded-xl p-8 border-2 border-gray-200">
				<div class="text-center mb-6">
					<span class="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mb-4">
						Agency Model
					</span>
					<p class="text-4xl font-bold text-gray-400">£800</p>
					<p class="text-gray-500">Client pays</p>
				</div>
				<div class="space-y-3 text-gray-600">
					<div class="flex justify-between">
						<span>You get</span>
						<span class="font-semibold">£400</span>
					</div>
					<div class="flex justify-between">
						<span>Agency takes</span>
						<span class="font-semibold text-error">£400</span>
					</div>
				</div>
			</div>

			<!-- IgniteGigs Model -->
			<div class="bg-white rounded-xl p-8 border-2 border-primary shadow-lg relative">
				<div class="absolute -top-3 left-1/2 -translate-x-1/2">
					<span class="inline-block px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
						Recommended
					</span>
				</div>
				<div class="text-center mb-6 mt-2">
					<span class="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
						IgniteGigs
					</span>
					<p class="text-4xl font-bold text-secondary">£500</p>
					<p class="text-gray-500">Client pays (lower!)</p>
				</div>
				<div class="space-y-3 text-gray-600">
					<div class="flex justify-between">
						<span>You get</span>
						<span class="font-semibold text-success">£460</span>
					</div>
					<div class="flex justify-between">
						<span>Platform fee (8%)</span>
						<span class="font-semibold">£40</span>
					</div>
				</div>
			</div>
		</div>

		<div class="text-center mt-12">
			<a href="/auth/signup?type=performer" class="btn-primary btn-lg">
				Join as Performer
			</a>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="py-16 md:py-24">
	<div class="container-wide">
		<div class="text-center mb-12">
			<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
				Everything you need to run your business
			</h2>
		</div>

		<div class="grid md:grid-cols-3 gap-8">
			<!-- Feature 1 -->
			<div class="text-center p-6">
				<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<span class="text-3xl">📹</span>
				</div>
				<h3 class="font-display text-xl font-semibold mb-2">Video Profiles</h3>
				<p class="text-gray-600">
					Showcase your best work with stunning video reels. Let clients see exactly what you do.
				</p>
			</div>

			<!-- Feature 2 -->
			<div class="text-center p-6">
				<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<span class="text-3xl">⭐</span>
				</div>
				<h3 class="font-display text-xl font-semibold mb-2">Verified Reviews</h3>
				<p class="text-gray-600">
					Build trust with real reviews from real bookings. Your reputation travels with you.
				</p>
			</div>

			<!-- Feature 3 -->
			<div class="text-center p-6">
				<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<span class="text-3xl">💰</span>
				</div>
				<h3 class="font-display text-xl font-semibold mb-2">Fast Payments</h3>
				<p class="text-gray-600">
					Get paid directly via Stripe. Deposits secured, payouts in 2-3 business days.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Testimonial Section -->
<section class="py-16 md:py-24 bg-secondary text-white">
	<div class="container-wide">
		<div class="max-w-3xl mx-auto text-center">
			<blockquote class="text-2xl md:text-3xl font-display mb-6">
				"I made £2,000 more last year after switching from my agency. Best decision I ever made."
			</blockquote>
			<div class="flex items-center justify-center gap-4">
				<div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
					<span class="text-xl">🔥</span>
				</div>
				<div class="text-left">
					<p class="font-semibold">Sarah K.</p>
					<p class="text-gray-400 text-sm">Fire Performer, Manchester</p>
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
				Ready to take control of your career?
			</h2>
			<p class="text-xl mb-8 opacity-90">
				Join free. Only 8% when you book. No monthly fees.
			</p>
			<a href="/auth/signup?type=performer" class="btn-lg bg-white text-primary hover:bg-gray-100 font-semibold px-8">
				Join Free — Takes 5 Minutes
			</a>
		</div>
	</div>
</section>

<!-- For Clients Section -->
<section class="py-16 md:py-24 bg-gray-50">
	<div class="container-wide">
		<div class="grid md:grid-cols-2 gap-12 items-center">
			<div>
				<span class="text-primary font-semibold text-sm uppercase tracking-wide">For Event Planners</span>
				<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mt-2 mb-4">
					Find the perfect performer in minutes
				</h2>
				<p class="text-gray-600 mb-6">
					Browse verified fire and LED performers with real video portfolios. See exactly what you're booking, with no hidden agency fees.
				</p>
				<ul class="space-y-3 mb-8">
					<li class="flex items-center gap-3">
						<span class="text-success">✓</span>
						<span>All performers verified and insured</span>
					</li>
					<li class="flex items-center gap-3">
						<span class="text-success">✓</span>
						<span>Secure deposit protection</span>
					</li>
					<li class="flex items-center gap-3">
						<span class="text-success">✓</span>
						<span>Direct messaging with performers</span>
					</li>
					<li class="flex items-center gap-3">
						<span class="text-success">✓</span>
						<span>Honest reviews from real events</span>
					</li>
				</ul>
				<a href="/performers" class="btn-primary btn-lg">
					Browse Performers
				</a>
			</div>
			<div class="bg-white rounded-2xl shadow-xl p-8">
				<div class="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
					<span class="text-6xl">🎪</span>
				</div>
				<p class="text-center text-gray-500 text-sm">
					Preview performer reels before booking
				</p>
			</div>
		</div>
	</div>
</section>
