<script lang="ts">
	// FAQ accordion state
	let openFaq = $state<number | null>(null);

	function toggleFaq(index: number) {
		openFaq = openFaq === index ? null : index;
	}

	const steps = [
		{
			number: 1,
			title: 'Search & Browse',
			description: 'Find performers by location, date, and category. Filter by fire, LED, circus arts, or dance to find exactly what your event needs.',
			icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
		},
		{
			number: 2,
			title: 'View Video Profiles',
			description: 'Watch performance reels, browse photo galleries, and read verified reviews from past clients. See exactly what you are booking.',
			icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
		},
		{
			number: 3,
			title: 'Send Inquiry',
			description: 'Message performers directly to discuss your event requirements, timing, and any special requests. No middlemen, no delays.',
			icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
		},
		{
			number: 4,
			title: 'Book & Pay Deposit',
			description: 'Secure your booking with a 25% deposit. The remaining balance is due after your event. Safe, secure Stripe payments.',
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
		},
		{
			number: 5,
			title: 'Enjoy Your Event',
			description: 'Your performer arrives ready to dazzle. Sit back and enjoy the amazing entertainment while your guests are wowed.',
			icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
		}
	];

	const trustSignals = [
		{
			title: 'Verified Performers',
			description: 'Every performer is identity-verified and has public liability insurance on file.',
			icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		{
			title: 'Secure Payments',
			description: 'All payments processed securely through Stripe. Your deposit is protected.',
			icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
		},
		{
			title: 'Insurance Required',
			description: 'All performers must have valid public liability insurance to join the platform.',
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
		}
	];

	const faqs = [
		{
			question: 'How much does it cost to book a performer?',
			answer: 'Pricing varies by performer, act type, duration, and location. Each performer sets their own rates, which you can see on their profile. There are no hidden fees - the price you see is what you pay. Performers typically charge between £200-£1,500 depending on the type of act and event duration.'
		},
		{
			question: 'How does the deposit work?',
			answer: 'When you confirm a booking, you pay a 25% deposit to secure the date. This deposit is held securely and goes directly to the performer after your event. The remaining 75% is due within 7 days after your event takes place.'
		},
		{
			question: 'Can I cancel my booking?',
			answer: 'Cancellation policies vary by performer and are displayed on their profile before you book. Most performers offer full deposit refunds for cancellations made 30+ days before the event. Always check the specific cancellation terms when booking.'
		},
		{
			question: 'How do I know the performers are legitimate?',
			answer: 'All performers on IgniteGigs are verified. We check their identity, require proof of public liability insurance, and only display genuine reviews from confirmed bookings. Look for the verified badge on performer profiles.'
		},
		{
			question: 'What if I need to change the event details?',
			answer: 'You can message your performer directly through the platform to discuss any changes. For minor adjustments like timing, most performers are flexible. Major changes may require rebooking or adjusting the fee.'
		},
		{
			question: 'Do performers provide their own equipment?',
			answer: 'Yes, professional performers bring all their own equipment, props, costumes, and safety gear. Some may have specific venue requirements (like fire safety clearance for fire acts) which they will discuss with you before confirming.'
		},
		{
			question: 'What areas do you cover?',
			answer: 'IgniteGigs has performers across the UK and Ireland. When you search, you will see performers who cover your event location. Many performers are willing to travel for events outside their usual area.'
		},
		{
			question: 'How far in advance should I book?',
			answer: 'We recommend booking at least 2-4 weeks in advance to secure your preferred performer. For peak seasons (weddings, festivals, Christmas) or high-demand performers, booking 2-3 months ahead is advisable.'
		}
	];
</script>

<svelte:head>
	<title>How to Book a Performer | IgniteGigs</title>
	<meta name="description" content="Learn how to book fire performers and LED artists on IgniteGigs. Simple 5-step process: search, watch videos, message directly, pay securely, enjoy your event." />
	<meta property="og:title" content="How to Book a Performer | IgniteGigs" />
	<meta property="og:description" content="Book fire and LED performers directly. No agency fees, transparent pricing, secure payments. Find your perfect entertainment in minutes." />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="How to Book a Performer | IgniteGigs" />
	<meta name="twitter:description" content="Book fire and LED performers directly. No agency fees, transparent pricing, secure payments." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-secondary via-secondary to-gray-900 text-white">
	<div class="container-wide py-16 md:py-24">
		<div class="max-w-3xl mx-auto text-center">
			<span class="inline-block px-4 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
				For Event Planners
			</span>
			<h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
				Book Amazing Entertainment
				<span class="text-primary">in Minutes</span>
			</h1>
			<p class="text-lg md:text-xl text-gray-300 mb-8">
				Skip the agency. Find verified fire and LED performers, watch their reels, and book directly.
				You save money, they earn more. Everyone wins.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/performers" class="btn-primary btn-lg">
					Browse Performers
				</a>
				<a href="#how-it-works" class="btn-ghost bg-white/10 hover:bg-white/20 text-white btn-lg">
					See How It Works
				</a>
			</div>
		</div>
	</div>
</section>

<!-- How It Works Section -->
<section id="how-it-works" class="py-16 md:py-24 bg-gray-50">
	<div class="container-wide">
		<div class="text-center mb-16">
			<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
				5 Simple Steps to Book
			</h2>
			<p class="text-lg text-gray-600 max-w-2xl mx-auto">
				From browsing to booking, we have made it easy to find and hire the perfect performer for your event.
			</p>
		</div>

		<!-- Steps -->
		<div class="relative">
			<!-- Connection Line (Desktop) -->
			<div class="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gray-200"></div>

			<div class="grid md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
				{#each steps as step}
					<div class="relative text-center">
						<!-- Step Number Circle -->
						<div class="relative inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full mb-6 shadow-lg z-10">
							<span class="font-display text-2xl font-bold">{step.number}</span>
						</div>

						<!-- Icon -->
						<div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
							<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={step.icon} />
							</svg>
						</div>

						<!-- Content -->
						<h3 class="font-display text-lg font-semibold text-secondary mb-2">
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
			<a href="/performers" class="btn-primary btn-lg">
				Start Browsing Now
			</a>
		</div>
	</div>
</section>

<!-- Trust Signals Section -->
<section class="py-16 md:py-24">
	<div class="container-wide">
		<div class="text-center mb-12">
			<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
				Book with Confidence
			</h2>
			<p class="text-lg text-gray-600 max-w-2xl mx-auto">
				Every booking is protected. Every performer is verified. Every payment is secure.
			</p>
		</div>

		<div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
			{#each trustSignals as signal}
				<div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
					<div class="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={signal.icon} />
						</svg>
					</div>
					<h3 class="font-display text-xl font-semibold text-secondary mb-2">
						{signal.title}
					</h3>
					<p class="text-gray-600">
						{signal.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Pricing Transparency Section -->
<section class="py-16 md:py-24 bg-secondary text-white">
	<div class="container-wide">
		<div class="grid md:grid-cols-2 gap-12 items-center">
			<div>
				<span class="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
					Transparent Pricing
				</span>
				<h2 class="font-display text-3xl md:text-4xl font-bold mb-6">
					No Hidden Fees.
					<span class="text-primary">Ever.</span>
				</h2>
				<p class="text-lg text-gray-300 mb-6">
					The price you see on a performer's profile is the price you pay. No agency markups,
					no service fees, no surprises. We are a performer-owned platform, and we believe in
					honest, transparent pricing for everyone.
				</p>
				<ul class="space-y-4">
					<li class="flex items-start gap-3">
						<span class="text-success mt-1">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
						</span>
						<span>Performer sets their own rates - you see the real price</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-success mt-1">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
						</span>
						<span>No booking fees or service charges added at checkout</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-success mt-1">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
						</span>
						<span>25% deposit secures booking, 75% after the event</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-success mt-1">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
						</span>
						<span>Travel fees (if any) clearly shown upfront</span>
					</li>
				</ul>
			</div>
			<div class="bg-white rounded-2xl p-8 text-gray-900">
				<h3 class="font-display text-xl font-semibold text-secondary mb-6 text-center">
					Why We Are Different
				</h3>
				<div class="space-y-6">
					<!-- Agency Comparison -->
					<div class="p-4 bg-gray-50 rounded-xl">
						<div class="flex justify-between items-center mb-2">
							<span class="text-gray-500 text-sm">Traditional Agency</span>
							<span class="text-gray-400 line-through">£800</span>
						</div>
						<div class="text-sm text-gray-500">
							Agency markup: <span class="text-error font-medium">+35-50%</span>
						</div>
					</div>

					<!-- IgniteGigs -->
					<div class="p-4 bg-primary/10 rounded-xl border-2 border-primary">
						<div class="flex justify-between items-center mb-2">
							<span class="text-primary font-medium">IgniteGigs</span>
							<span class="text-secondary font-bold text-xl">£500</span>
						</div>
						<div class="text-sm text-gray-600">
							No markup - <span class="text-success font-medium">Save 35%+</span>
						</div>
					</div>

					<p class="text-center text-sm text-gray-500">
						Same performer, same quality, better price.
					</p>
				</div>
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
				<p class="text-lg text-gray-600">
					Everything you need to know about booking performers on IgniteGigs.
				</p>
			</div>

			<div class="space-y-4">
				{#each faqs as faq, index}
					<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
						<button
							class="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
							onclick={() => toggleFaq(index)}
							aria-expanded={openFaq === index}
						>
							<span class="font-semibold text-secondary">{faq.question}</span>
							<svg
								class="w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 {openFaq === index ? 'rotate-180' : ''}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
						{#if openFaq === index}
							<div class="px-6 pb-5">
								<p class="text-gray-600 leading-relaxed">{faq.answer}</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Final CTA Section -->
<section class="py-16 md:py-24">
	<div class="container-wide">
		<div class="bg-gradient-fire rounded-3xl p-8 md:p-16 text-center text-white">
			<h2 class="font-display text-3xl md:text-4xl font-bold mb-4">
				Ready to Find Your Perfect Performer?
			</h2>
			<p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
				Browse hundreds of verified fire and LED performers. Watch their reels, read reviews, and book directly.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/performers" class="btn-lg bg-white text-primary hover:bg-gray-100 font-semibold px-8">
					Browse Performers
				</a>
				<a href="/auth/signup" class="btn-lg bg-white/20 hover:bg-white/30 text-white font-semibold px-8">
					Create Account
				</a>
			</div>
		</div>
	</div>
</section>
