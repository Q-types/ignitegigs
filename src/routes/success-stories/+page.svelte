<script lang="ts">
	import Rating from '$lib/components/ui/Rating.svelte';

	interface SuccessStory {
		id: string;
		name: string;
		type: 'individual' | 'group';
		specialty: string;
		location: string;
		initials: string;
		avatarColor: string;
		headline: string;
		quote: string;
		stats: {
			bookings: number;
			earnings?: number;
			rating?: number;
			extra?: string;
		};
		vouchedBy?: string;
		yearOnPlatform: string;
	}

	const stories: SuccessStory[] = [
		{
			id: 'sarah-k',
			name: 'Sarah K.',
			type: 'individual',
			specialty: 'Fire Performer',
			location: 'Manchester',
			initials: 'SK',
			avatarColor: 'bg-primary',
			headline: 'Switched from agency, earned £2,000 more last year',
			quote: "The freedom to set my own rates and build direct relationships with clients has been life-changing. I'm no longer just a name on an agency roster - clients remember me, rebook me, and refer me to their friends. That personal connection is worth more than any commission.",
			stats: {
				bookings: 45,
				earnings: 18000,
				rating: 4.9
			},
			vouchedBy: 'Marcus J. & 3 others',
			yearOnPlatform: '2 years'
		},
		{
			id: 'marcus-j',
			name: 'Marcus J.',
			type: 'individual',
			specialty: 'LED Dancer',
			location: 'London',
			initials: 'MJ',
			avatarColor: 'bg-blue-500',
			headline: 'Built my reputation from scratch with the vouching system',
			quote: "When I started, I had zero professional bookings. The community vouching system connected me with experienced performers who mentored me. Sarah vouched for me after seeing my first show, and that credibility opened so many doors. Now I'm vouching for newcomers too.",
			stats: {
				bookings: 28,
				rating: 4.8,
				extra: 'First year on platform'
			},
			vouchedBy: 'Sarah K. & 2 others',
			yearOnPlatform: '1 year'
		},
		{
			id: 'collective-flames',
			name: 'Collective Flames',
			type: 'group',
			specialty: 'Fire Troupe',
			location: 'Bristol',
			initials: 'CF',
			avatarColor: 'bg-amber-500',
			headline: 'We book as a team, split payments easily',
			quote: "Managing a troupe of 6 performers used to mean spreadsheets, PayPal transfers, and endless admin. Now clients book us as a group, and the platform handles the split automatically. We've doubled our bookings because we can actually focus on performing, not paperwork.",
			stats: {
				bookings: 60,
				earnings: 45000,
				rating: 5.0,
				extra: '6 troupe members'
			},
			vouchedBy: 'Bristol Fire Community',
			yearOnPlatform: '18 months'
		},
		{
			id: 'emma-t',
			name: 'Emma T.',
			type: 'individual',
			specialty: 'Fire Poi Artist',
			location: 'Edinburgh',
			initials: 'ET',
			avatarColor: 'bg-purple-500',
			headline: 'Part-time performer, full control of my schedule',
			quote: "I work a day job and perform on weekends. The calendar system lets me block out my unavailable times, so I only get enquiries for gigs I can actually do. Last year I earned £8,000 extra income doing something I love, completely on my own terms.",
			stats: {
				bookings: 24,
				earnings: 8000,
				rating: 4.7,
				extra: 'Weekend performer'
			},
			vouchedBy: 'Edinburgh Fire Circle',
			yearOnPlatform: '14 months'
		}
	];

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP',
			maximumFractionDigits: 0
		}).format(amount);
	}
</script>

<svelte:head>
	<title>Success Stories | IgniteGigs - Real Performers, Real Results</title>
	<meta
		name="description"
		content="Discover how fire and LED performers are earning more and building their careers on IgniteGigs. Real stories from performers keeping 92% of their earnings."
	/>
	<meta
		name="keywords"
		content="fire performer success, LED performer income, performer marketplace stories, IgniteGigs testimonials"
	/>
	<meta property="og:title" content="Success Stories | IgniteGigs" />
	<meta
		property="og:description"
		content="Real performers sharing how they've grown their careers and earnings on IgniteGigs."
	/>
	<meta property="og:type" content="website" />
	<link rel="canonical" href="https://ignitegigs.com/success-stories" />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-secondary via-secondary to-gray-900 text-white">
	<div class="container-wide py-16 md:py-24">
		<div class="max-w-3xl mx-auto text-center">
			<h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
				Real Performers,
				<span class="text-primary">Real Results</span>
			</h1>
			<p class="text-lg md:text-xl text-gray-300 mb-8">
				See how performers are taking control of their careers, keeping 92% of what they earn, and
				building real connections with clients.
			</p>
			<div class="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
				<div class="flex items-center gap-2">
					<span class="text-primary font-bold text-2xl">92%</span>
					<span>goes to performers</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="text-primary font-bold text-2xl">£0</span>
					<span>monthly fees</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="text-primary font-bold text-2xl">100%</span>
					<span>your clients</span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Featured Stories -->
<section class="py-16 md:py-24">
	<div class="container-wide">
		<div class="text-center mb-12">
			<span class="text-primary font-semibold text-sm uppercase tracking-wide"
				>Featured Stories</span
			>
			<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mt-2">
				From Our Community
			</h2>
		</div>

		<div class="space-y-12 md:space-y-16">
			{#each stories as story, index}
				<article
					class="bg-white rounded-2xl shadow-lg overflow-hidden {index % 2 === 1
						? 'md:flex-row-reverse'
						: ''}"
				>
					<div class="md:flex">
						<!-- Story Content -->
						<div
							class="flex-1 p-8 md:p-12 {index % 2 === 1 ? 'md:order-2' : ''}"
						>
							<!-- Profile Header -->
							<div class="flex items-start gap-4 mb-6">
								<div
									class="w-16 h-16 md:w-20 md:h-20 {story.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl shrink-0"
								>
									{story.initials}
								</div>
								<div>
									<h3 class="font-display text-xl md:text-2xl font-bold text-secondary">
										{story.name}
									</h3>
									<p class="text-gray-600">
										{story.specialty} &bull; {story.location}
									</p>
									<div class="flex items-center gap-2 mt-1">
										{#if story.stats.rating}
											<Rating value={story.stats.rating} size="sm" />
											<span class="text-sm text-gray-500">{story.stats.rating}</span>
										{/if}
									</div>
								</div>
							</div>

							<!-- Headline -->
							<h4 class="font-display text-xl md:text-2xl font-semibold text-secondary mb-4">
								"{story.headline}"
							</h4>

							<!-- Quote -->
							<blockquote class="text-gray-600 mb-6 leading-relaxed">
								"{story.quote}"
							</blockquote>

							<!-- Vouched By -->
							{#if story.vouchedBy}
								<div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
									<svg
										class="w-5 h-5 text-success"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<span>Vouched by: <span class="font-medium">{story.vouchedBy}</span></span>
								</div>
							{/if}
						</div>

						<!-- Stats Panel -->
						<div
							class="md:w-80 lg:w-96 bg-gray-50 p-8 md:p-12 flex flex-col justify-center {index % 2 === 1 ? 'md:order-1' : ''}"
						>
							<div class="space-y-6">
								<!-- Bookings -->
								<div class="text-center md:text-left">
									<p class="text-4xl md:text-5xl font-bold text-secondary">
										{story.stats.bookings}
									</p>
									<p class="text-gray-600">bookings completed</p>
								</div>

								<!-- Earnings -->
								{#if story.stats.earnings}
									<div class="text-center md:text-left">
										<p class="text-4xl md:text-5xl font-bold text-primary">
											{formatCurrency(story.stats.earnings)}
										</p>
										<p class="text-gray-600">earned on platform</p>
									</div>
								{/if}

								<!-- Extra Info -->
								{#if story.stats.extra}
									<div
										class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
									>
										{story.stats.extra}
									</div>
								{/if}

								<!-- Time on Platform -->
								<div class="text-center md:text-left pt-4 border-t border-gray-200">
									<p class="text-sm text-gray-500">
										Member for <span class="font-semibold">{story.yearOnPlatform}</span>
									</p>
								</div>
							</div>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- Community Section -->
<section class="py-16 md:py-24 bg-gray-50">
	<div class="container-wide">
		<div class="max-w-4xl mx-auto text-center">
			<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-6">
				Built by Performers, for Performers
			</h2>
			<p class="text-xl text-gray-600 mb-12">
				IgniteGigs isn't just a booking platform - it's a community where experienced performers
				vouch for newcomers, share advice, and lift each other up.
			</p>

			<div class="grid md:grid-cols-3 gap-8">
				<!-- Community Stat 1 -->
				<div class="bg-white rounded-xl p-8 shadow-sm">
					<div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</div>
					<p class="text-3xl font-bold text-secondary mb-2">500+</p>
					<p class="text-gray-600">Verified performers</p>
				</div>

				<!-- Community Stat 2 -->
				<div class="bg-white rounded-xl p-8 shadow-sm">
					<div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
					<p class="text-3xl font-bold text-secondary mb-2">1,200+</p>
					<p class="text-gray-600">Community vouches given</p>
				</div>

				<!-- Community Stat 3 -->
				<div class="bg-white rounded-xl p-8 shadow-sm">
					<div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<p class="text-3xl font-bold text-secondary mb-2">£2.1M+</p>
					<p class="text-gray-600">Paid to performers</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- How It Works Mini Section -->
<section class="py-16 md:py-24">
	<div class="container-wide">
		<div class="max-w-4xl mx-auto">
			<div class="text-center mb-12">
				<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
					How Performers Succeed Here
				</h2>
			</div>

			<div class="grid md:grid-cols-3 gap-8">
				<div class="text-center">
					<div
						class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl"
					>
						1
					</div>
					<h3 class="font-display text-lg font-semibold mb-2">Create Your Profile</h3>
					<p class="text-gray-600">
						Showcase your skills with videos, set your rates, and define your availability.
					</p>
				</div>

				<div class="text-center">
					<div
						class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl"
					>
						2
					</div>
					<h3 class="font-display text-lg font-semibold mb-2">Get Vouched</h3>
					<p class="text-gray-600">
						Connect with the community. Experienced performers vouch for your skills.
					</p>
				</div>

				<div class="text-center">
					<div
						class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl"
					>
						3
					</div>
					<h3 class="font-display text-lg font-semibold mb-2">Grow Your Business</h3>
					<p class="text-gray-600">
						Accept bookings, build client relationships, and keep 92% of every gig.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-16 md:py-24 bg-secondary">
	<div class="container-wide">
		<div class="max-w-3xl mx-auto text-center text-white">
			<h2 class="font-display text-3xl md:text-4xl font-bold mb-4">Start Your Success Story</h2>
			<p class="text-xl text-gray-300 mb-8">
				Join free. No monthly fees. Only 8% when you book - because you earned it.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a
					href="/auth/signup?type=performer"
					class="btn-lg bg-primary text-white hover:bg-primary-dark font-semibold px-8"
				>
					Join as Performer
				</a>
				<a
					href="/performers"
					class="btn-lg bg-white text-secondary hover:bg-gray-100 font-semibold px-8"
				>
					Browse Performers
				</a>
			</div>
		</div>
	</div>
</section>
