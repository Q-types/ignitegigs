<script lang="ts">
	// Steps data for the process section
	const steps = [
		{
			number: 1,
			title: 'Sign Up Free',
			description: 'Create your performer account in minutes. No monthly fees, no hidden charges. You only pay when you book a gig.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
			</svg>`
		},
		{
			number: 2,
			title: 'Build Your Profile',
			description: 'Upload video portfolios, photos, and your bio. Set your rates, travel radius, and manage your availability calendar.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
			</svg>`
		},
		{
			number: 3,
			title: 'Get Discovered',
			description: 'Clients search by location, date, and performance category. Your stunning videos and verified reviews help you stand out.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
			</svg>`
		},
		{
			number: 4,
			title: 'Book Direct',
			description: 'Receive booking requests with secure deposit protection. Communicate directly with clients - no middleman, no delays.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
			</svg>`
		},
		{
			number: 5,
			title: 'Get Paid Fast',
			description: 'Keep 92% of every booking. Stripe handles payments securely with payouts landing in your account in 2-3 business days.',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
				<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
			</svg>`
		}
	];

	// Comparison data for agency vs IgniteGigs
	const comparisonItems = [
		{ feature: 'Commission', agency: '35-50%', ignite: 'Just 8%', highlight: true },
		{ feature: 'Monthly fees', agency: 'Often required', ignite: 'None - ever', highlight: false },
		{ feature: 'Profile control', agency: 'Limited', ignite: 'Full creative control', highlight: false },
		{ feature: 'Client communication', agency: 'Through agency', ignite: 'Direct messaging', highlight: false },
		{ feature: 'Pricing control', agency: 'Agency sets rates', ignite: 'You set your rates', highlight: false },
		{ feature: 'Payment speed', agency: '30-60 days', ignite: '2-3 business days', highlight: true },
		{ feature: 'Booking transparency', agency: 'Often opaque', ignite: 'Full visibility', highlight: false },
		{ feature: 'Your data', agency: 'Agency owns it', ignite: 'You own everything', highlight: false }
	];
</script>

<svelte:head>
	<title>How It Works for Performers | IgniteGigs</title>
	<meta name="description" content="Join IgniteGigs and keep 92% of every booking. Create your free profile, get discovered by clients, and get paid fast. No agency fees, no middlemen." />
	<meta property="og:title" content="How It Works for Performers | IgniteGigs" />
	<meta property="og:description" content="Join IgniteGigs and keep 92% of every booking. Create your free profile, get discovered by clients, and get paid fast." />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="How It Works for Performers | IgniteGigs" />
	<meta name="twitter:description" content="Join IgniteGigs and keep 92% of every booking. Create your free profile, get discovered by clients, and get paid fast." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-secondary via-secondary to-gray-900 text-white">
	<div class="container-wide py-16 md:py-24">
		<div class="max-w-3xl mx-auto text-center">
			<span class="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-semibold mb-6">
				For Performers
			</span>
			<h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
				Your talent, your terms,
				<span class="text-primary">your 92%.</span>
			</h1>
			<p class="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
				Stop losing thousands to agency fees. IgniteGigs is the performer-owned platform built by fire artists, for fire artists.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/auth/signup?type=performer" class="btn-primary btn-lg">
					Join Free Today
				</a>
				<a href="/performers" class="btn-ghost btn-lg text-white hover:bg-white/10">
					Browse Performers
				</a>
			</div>
		</div>
	</div>
</section>

<!-- 5-Step Process Section -->
<section class="py-16 md:py-24">
	<div class="container-wide">
		<div class="text-center mb-16">
			<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
				From signup to payday in 5 simple steps
			</h2>
			<p class="text-xl text-gray-600 max-w-2xl mx-auto">
				Getting started takes less than 10 minutes. Here's how it works.
			</p>
		</div>

		<!-- Steps Grid -->
		<div class="relative">
			<!-- Connection line (desktop only) - positioned below icons -->
			<div class="hidden lg:block absolute top-[5.5rem] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -z-10"></div>

			<div class="grid md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
				{#each steps as step}
					<div class="relative text-center group">
						<!-- Step number badge -->
						<div class="relative z-10 inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-primary rounded-2xl shadow-lg mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
							<div class="text-primary">
								{@html step.icon}
							</div>
							<span class="absolute -top-2 -right-2 w-7 h-7 bg-primary text-white text-sm font-bold rounded-full flex items-center justify-center">
								{step.number}
							</span>
						</div>

						<h3 class="font-display text-xl font-semibold text-secondary mb-2">
							{step.title}
						</h3>
						<p class="text-gray-600 text-sm leading-relaxed">
							{step.description}
						</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="text-center mt-12">
			<a href="/auth/signup?type=performer" class="btn-primary btn-lg">
				Start Your Free Profile
			</a>
		</div>
	</div>
</section>

<!-- Comparison Section: Agency vs IgniteGigs -->
<section class="py-16 md:py-24 bg-gray-50">
	<div class="container-wide">
		<div class="text-center mb-12">
			<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
				Why performers are switching
			</h2>
			<p class="text-xl text-gray-600">
				The difference between agencies and IgniteGigs is clear.
			</p>
		</div>

		<div class="max-w-4xl mx-auto">
			<!-- Comparison Table -->
			<div class="bg-white rounded-2xl shadow-xl overflow-hidden">
				<!-- Header -->
				<div class="grid grid-cols-3 bg-secondary text-white">
					<div class="p-4 md:p-6 font-semibold">Feature</div>
					<div class="p-4 md:p-6 font-semibold text-center border-l border-white/10">Traditional Agency</div>
					<div class="p-4 md:p-6 font-semibold text-center border-l border-white/10 bg-primary">IgniteGigs</div>
				</div>

				<!-- Rows -->
				{#each comparisonItems as item, index}
					<div class="grid grid-cols-3 {index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} {item.highlight ? 'bg-primary/5' : ''}">
						<div class="p-4 md:p-6 font-medium text-secondary border-t border-gray-100">
							{item.feature}
						</div>
						<div class="p-4 md:p-6 text-center text-gray-500 border-t border-l border-gray-100">
							{item.agency}
						</div>
						<div class="p-4 md:p-6 text-center font-semibold border-t border-l border-gray-100 {item.highlight ? 'text-primary' : 'text-success'}">
							{item.ignite}
						</div>
					</div>
				{/each}
			</div>

			<!-- Bottom highlight -->
			<div class="mt-8 p-6 bg-primary/10 rounded-xl border border-primary/20 text-center">
				<p class="text-lg text-secondary">
					<span class="font-bold">On a typical £500 booking:</span> You keep <span class="text-primary font-bold">£460</span> with IgniteGigs vs <span class="text-gray-500">£250-325</span> with agencies.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Features Deep Dive -->
<section class="py-16 md:py-24">
	<div class="container-wide">
		<div class="text-center mb-16">
			<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
				Everything you need to succeed
			</h2>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
			<!-- Video Portfolio -->
			<div class="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
				<div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-primary">
						<path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
					</svg>
				</div>
				<h3 class="font-display text-xl font-semibold text-secondary mb-3">Video Portfolio</h3>
				<p class="text-gray-600">
					Upload stunning performance videos that autoplay as clients browse. Show exactly what you do - no guesswork for bookers.
				</p>
			</div>

			<!-- Availability Calendar -->
			<div class="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
				<div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-primary">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
					</svg>
				</div>
				<h3 class="font-display text-xl font-semibold text-secondary mb-3">Availability Calendar</h3>
				<p class="text-gray-600">
					Sync your schedule and let clients see when you're free. Only get requests for dates you're actually available.
				</p>
			</div>

			<!-- Secure Payments -->
			<div class="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
				<div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-primary">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
					</svg>
				</div>
				<h3 class="font-display text-xl font-semibold text-secondary mb-3">Secure Payments</h3>
				<p class="text-gray-600">
					Deposits protected through Stripe. No more chasing payments or worrying about cancellations. We've got you covered.
				</p>
			</div>

			<!-- Verified Reviews -->
			<div class="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
				<div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-primary">
						<path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
					</svg>
				</div>
				<h3 class="font-display text-xl font-semibold text-secondary mb-3">Verified Reviews</h3>
				<p class="text-gray-600">
					Build your reputation with real reviews from completed bookings. Your track record travels with you wherever you go.
				</p>
			</div>

			<!-- Direct Messaging -->
			<div class="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
				<div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-primary">
						<path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
					</svg>
				</div>
				<h3 class="font-display text-xl font-semibold text-secondary mb-3">Direct Messaging</h3>
				<p class="text-gray-600">
					Chat directly with clients to discuss event details. No more broken telephone through agency middlemen.
				</p>
			</div>

			<!-- Set Your Rates -->
			<div class="bg-white rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
				<div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-primary">
						<path stroke-linecap="round" stroke-linejoin="round" d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
					</svg>
				</div>
				<h3 class="font-display text-xl font-semibold text-secondary mb-3">Set Your Rates</h3>
				<p class="text-gray-600">
					You decide what you're worth. Set different rates for different performance types. Adjust anytime.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Community Vouching Section -->
<section class="py-16 md:py-24 bg-secondary text-white">
	<div class="container-wide">
		<div class="grid lg:grid-cols-2 gap-12 items-center">
			<div>
				<span class="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-semibold mb-6">
					Community Powered
				</span>
				<h2 class="font-display text-3xl md:text-4xl font-bold mb-6">
					Vouched by the community
				</h2>
				<p class="text-gray-300 text-lg mb-6">
					New to the scene? Our unique vouching system lets experienced performers endorse newcomers they've worked with or trained.
				</p>
				<ul class="space-y-4 mb-8">
					<li class="flex items-start gap-3">
						<span class="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-white">
								<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
						</span>
						<span>Get vouched by performers you've trained with or performed alongside</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-white">
								<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
						</span>
						<span>Vouched performers get a trust badge that helps win more bookings</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-white">
								<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
						</span>
						<span>Build genuine connections in the fire and LED community</span>
					</li>
				</ul>
				<p class="text-sm text-gray-400">
					We're building more than a marketplace - we're building a community where performers lift each other up.
				</p>
			</div>

			<!-- Visual representation -->
			<div class="relative">
				<div class="bg-secondary-light rounded-2xl p-8">
					<!-- Vouch chain visualization -->
					<div class="flex items-center justify-center gap-4 mb-8">
						<div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl shadow-lg">
							<span>1</span>
						</div>
						<div class="flex-1 h-1 bg-gradient-to-r from-primary to-primary/50 rounded"></div>
						<div class="w-16 h-16 bg-white/20 border-2 border-primary/50 rounded-full flex items-center justify-center text-2xl">
							<span>2</span>
						</div>
						<div class="flex-1 h-1 bg-gradient-to-r from-primary/50 to-primary/20 rounded"></div>
						<div class="w-16 h-16 bg-white/10 border-2 border-white/30 rounded-full flex items-center justify-center text-2xl">
							<span>3</span>
						</div>
					</div>

					<div class="space-y-4">
						<div class="bg-white/10 rounded-lg p-4 flex items-center gap-4">
							<div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
								</svg>
							</div>
							<div class="flex-1">
								<p class="font-semibold">"Alex trained with me for 2 years"</p>
								<p class="text-sm text-gray-400">Sarah K. - Vouched performer</p>
							</div>
						</div>

						<div class="bg-white/5 rounded-lg p-4 flex items-center gap-4">
							<div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-400">
									<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
								</svg>
							</div>
							<div class="flex-1">
								<p class="text-gray-300">New performer joins...</p>
								<p class="text-sm text-gray-500">Awaiting community vouch</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- FAQ Section -->
<section class="py-16 md:py-24 bg-gray-50">
	<div class="container-wide">
		<div class="text-center mb-12">
			<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
				Common questions
			</h2>
		</div>

		<div class="max-w-3xl mx-auto space-y-4">
			<div class="bg-white rounded-xl p-6 shadow-card">
				<h3 class="font-display text-lg font-semibold text-secondary mb-2">Is it really free to join?</h3>
				<p class="text-gray-600">Yes, completely free. No monthly subscription, no listing fees, no hidden costs. We only take 8% when you successfully complete a booking.</p>
			</div>

			<div class="bg-white rounded-xl p-6 shadow-card">
				<h3 class="font-display text-lg font-semibold text-secondary mb-2">How do payments work?</h3>
				<p class="text-gray-600">Clients pay a deposit when booking (typically 50%). After the gig, you confirm completion and receive 92% of the total via Stripe in 2-3 business days.</p>
			</div>

			<div class="bg-white rounded-xl p-6 shadow-card">
				<h3 class="font-display text-lg font-semibold text-secondary mb-2">What if a client cancels?</h3>
				<p class="text-gray-600">Our cancellation policy protects you. Deposits are non-refundable within 14 days of the event, so you're covered for last-minute cancellations.</p>
			</div>

			<div class="bg-white rounded-xl p-6 shadow-card">
				<h3 class="font-display text-lg font-semibold text-secondary mb-2">Do I need insurance?</h3>
				<p class="text-gray-600">Yes, you'll need valid public liability insurance to list on IgniteGigs. This protects both you and your clients, and we help verify your coverage.</p>
			</div>

			<div class="bg-white rounded-xl p-6 shadow-card">
				<h3 class="font-display text-lg font-semibold text-secondary mb-2">Can I still work with agencies?</h3>
				<p class="text-gray-600">Absolutely. IgniteGigs is an additional channel for bookings. Use us alongside agencies, or transition fully - it's your choice.</p>
			</div>
		</div>
	</div>
</section>

<!-- Final CTA Section -->
<section class="py-16 md:py-24">
	<div class="container-wide">
		<div class="bg-gradient-fire rounded-3xl p-8 md:p-16 text-center text-white">
			<h2 class="font-display text-3xl md:text-4xl font-bold mb-4">
				Ready to keep more of what you earn?
			</h2>
			<p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
				Join hundreds of fire and LED performers who've taken back control of their careers. Sign up takes just 5 minutes.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/auth/signup?type=performer" class="btn-lg bg-white text-primary hover:bg-gray-100 font-semibold px-8 inline-flex items-center justify-center">
					Create Free Account
				</a>
				<a href="/performers" class="btn-lg bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 inline-flex items-center justify-center">
					See Our Performers
				</a>
			</div>
			<p class="mt-6 text-sm opacity-75">
				No credit card required. No monthly fees. Ever.
			</p>
		</div>
	</div>
</section>
