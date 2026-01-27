<script lang="ts">
	// Team members - placeholder data for future updates
	const teamMembers = [
		{
			name: 'Coming Soon',
			role: 'Founder',
			bio: 'A performer who wanted something better.',
			image: null
		}
	];

	const values = [
		{
			icon: 'currency',
			title: 'Fair Pay',
			description: '92% goes to performers. Always. No hidden fees, no surprise deductions. Transparent pricing that respects your worth.',
			highlight: '92%'
		},
		{
			icon: 'users',
			title: 'Community First',
			description: 'Our vouching system connects experienced performers with newcomers. Mentorship, support, and a community that lifts everyone up.',
			highlight: 'Vouching'
		},
		{
			icon: 'link',
			title: 'Direct Connection',
			description: 'No middlemen. No gatekeepers. Real relationships between performers and clients that last beyond single bookings.',
			highlight: 'Direct'
		},
		{
			icon: 'shield',
			title: 'Trust & Safety',
			description: 'Every performer is verified. Every payment is secured. Background checks, insurance verification, and escrow protection.',
			highlight: 'Verified'
		}
	];

	const valueIcons: Record<string, string> = {
		currency: 'M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
		users: 'M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z',
		link: 'M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244',
		shield: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z'
	};

	const differences = [
		{
			label: "We're NOT an agency",
			description: "We don't take bookings for you or manage your career. You're in control of every decision, every price, every gig."
		},
		{
			label: "We're NOT a gig economy app",
			description: "No race to the bottom. No algorithm deciding your worth. Fair fees that let you charge what you deserve."
		},
		{
			label: "We ARE a community marketplace",
			description: "Built by performers, owned by the community. Every feature designed by people who've stood on stage, not in boardrooms."
		}
	];
</script>

<svelte:head>
	<title>About Us - Our Story | IgniteGigs</title>
	<meta name="description" content="IgniteGigs is a performer-owned marketplace where entertainers keep 92% of every booking. Built by performers, for performers. Learn about our mission to transform the entertainment industry." />
	<meta property="og:title" content="About Us - Our Story | IgniteGigs" />
	<meta property="og:description" content="A performer-owned marketplace where entertainers keep 92%. Built by performers who wanted something better." />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/og-about.png" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="About Us - Our Story | IgniteGigs" />
	<meta name="twitter:description" content="A performer-owned marketplace where entertainers keep 92%. Built by performers who wanted something better." />
	<link rel="canonical" href="https://ignitegigs.com/about" />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-secondary via-secondary to-gray-900 text-white py-20 md:py-32">
	<div class="container-wide">
		<div class="max-w-4xl mx-auto text-center">
			<span class="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-semibold mb-6">
				Our Story
			</span>
			<h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
				Built by Performers,
				<span class="text-gradient-fire">For Performers</span>
			</h1>
			<p class="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
				We got tired of agencies taking half our earnings and treating us like inventory.
				So we built something different. Something that puts performers first.
			</p>
		</div>
	</div>
</section>

<!-- Our Story Section -->
<section class="py-16 md:py-24 bg-white">
	<div class="container-wide">
		<div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
			<div>
				<span class="text-primary font-semibold text-sm uppercase tracking-wide">The Problem</span>
				<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mt-2 mb-6">
					The industry was broken
				</h2>
				<div class="space-y-4 text-gray-600 text-lg">
					<p>
						For decades, entertainment agencies have controlled the industry. They promise exposure
						and bookings, but the reality is different: <strong class="text-secondary">35-50% of every gig</strong> goes
						to someone who answered an email.
					</p>
					<p>
						Performers have no control over their pricing. No direct relationships with clients.
						No way to build a sustainable career without giving away half their income.
					</p>
					<p>
						We knew there had to be a better way.
					</p>
				</div>
			</div>
			<div class="bg-gray-100 rounded-2xl p-8 lg:p-12">
				<div class="text-center">
					<p class="text-6xl md:text-7xl font-bold text-gray-300 mb-2">35-50%</p>
					<p class="text-gray-500 text-lg">taken by traditional agencies</p>
					<div class="w-16 h-1 bg-primary mx-auto my-6"></div>
					<p class="text-5xl md:text-6xl font-bold text-primary mb-2">8%</p>
					<p class="text-gray-600 text-lg font-medium">our platform fee</p>
				</div>
			</div>
		</div>

		<div class="mt-16 lg:mt-24">
			<div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
				<div class="order-2 lg:order-1 bg-gradient-fire rounded-2xl p-8 lg:p-12 text-white">
					<blockquote class="text-2xl md:text-3xl font-display leading-relaxed">
						"We believe performers should keep what they earn."
					</blockquote>
					<div class="mt-6 flex items-center gap-3">
						<div class="w-1 h-12 bg-white/30 rounded-full"></div>
						<p class="text-white/80">The founding principle of IgniteGigs</p>
					</div>
				</div>
				<div class="order-1 lg:order-2">
					<span class="text-primary font-semibold text-sm uppercase tracking-wide">The Solution</span>
					<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mt-2 mb-6">
						A platform owned by the community
					</h2>
					<div class="space-y-4 text-gray-600 text-lg">
						<p>
							IgniteGigs isn't just performer-friendly. It's <strong class="text-secondary">performer-owned</strong>.
							Every decision we make starts with one question: does this help performers succeed?
						</p>
						<p>
							We take just 8% to keep the lights on and continuously improve the platform.
							The rest - <strong class="text-primary">92%</strong> - goes directly to you.
						</p>
						<p>
							No investors demanding growth at all costs. No pressure to squeeze performers for profit.
							Just a sustainable platform built to serve the community that powers it.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Mission & Vision Section -->
<section class="py-16 md:py-24 bg-gray-50">
	<div class="container-wide">
		<div class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
			<!-- Mission -->
			<div class="bg-white rounded-2xl p-8 lg:p-10 shadow-card">
				<div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
					<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
					</svg>
				</div>
				<h2 class="font-display text-2xl font-bold text-secondary mb-4">Our Mission</h2>
				<p class="text-gray-600 text-lg leading-relaxed">
					To empower performers with <strong class="text-secondary">fair pay</strong>,
					<strong class="text-secondary">direct relationships</strong>, and
					<strong class="text-secondary">community support</strong> - creating an entertainment
					industry that works for everyone, not just the middlemen.
				</p>
			</div>

			<!-- Vision -->
			<div class="bg-secondary rounded-2xl p-8 lg:p-10 text-white">
				<div class="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mb-6">
					<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
					</svg>
				</div>
				<h2 class="font-display text-2xl font-bold mb-4">Our Vision</h2>
				<p class="text-gray-300 text-lg leading-relaxed">
					A world where <strong class="text-white">every performer controls their career</strong> and
					<strong class="text-white">earns what they deserve</strong>. Where talent is valued,
					relationships are direct, and success is shared by those who create it.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Values Section -->
<section class="py-16 md:py-24 bg-white">
	<div class="container-wide">
		<div class="text-center mb-12 md:mb-16">
			<span class="text-primary font-semibold text-sm uppercase tracking-wide">What We Stand For</span>
			<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mt-2">
				Our Core Values
			</h2>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
			{#each values as value}
				<div class="group bg-gray-50 hover:bg-white rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:shadow-card-hover border border-transparent hover:border-primary/20">
					<div class="w-14 h-14 bg-primary/10 group-hover:bg-primary/20 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300">
						<svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={valueIcons[value.icon]} />
						</svg>
					</div>
					<div class="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">
						{value.highlight}
					</div>
					<h3 class="font-display text-xl font-bold text-secondary mb-3">{value.title}</h3>
					<p class="text-gray-600 leading-relaxed">{value.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- The Difference Section -->
<section class="py-16 md:py-24 bg-secondary text-white">
	<div class="container-wide">
		<div class="text-center mb-12 md:mb-16">
			<span class="text-primary font-semibold text-sm uppercase tracking-wide">What Makes Us Different</span>
			<h2 class="font-display text-3xl md:text-4xl font-bold mt-2">
				The IgniteGigs Difference
			</h2>
		</div>

		<div class="max-w-4xl mx-auto space-y-6">
			{#each differences as diff, index}
				<div class="bg-white/5 backdrop-blur rounded-2xl p-6 lg:p-8 border border-white/10 hover:border-primary/50 transition-colors duration-300">
					<div class="flex items-start gap-4 lg:gap-6">
						<div class="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold text-lg">
							{index + 1}
						</div>
						<div>
							<h3 class="font-display text-xl font-bold mb-2">{diff.label}</h3>
							<p class="text-gray-400 text-lg leading-relaxed">{diff.description}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="text-center mt-12">
			<p class="text-2xl md:text-3xl font-display text-gray-300">
				Performers supporting performers. <span class="text-primary">That's the difference.</span>
			</p>
		</div>
	</div>
</section>

<!-- Team Section -->
<section class="py-16 md:py-24 bg-gray-50">
	<div class="container-wide">
		<div class="text-center mb-12 md:mb-16">
			<span class="text-primary font-semibold text-sm uppercase tracking-wide">The Team</span>
			<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mt-2 mb-4">
				Founded by performers who wanted something better
			</h2>
			<p class="text-gray-600 text-lg max-w-2xl mx-auto">
				We've walked the same stages, dealt with the same agencies, and faced the same frustrations.
				That's why we're building this - because we know exactly what performers need.
			</p>
		</div>

		<!-- Team Grid Placeholder -->
		<div class="max-w-4xl mx-auto">
			<div class="bg-white rounded-2xl p-8 lg:p-12 text-center border-2 border-dashed border-gray-200">
				<div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
					</svg>
				</div>
				<h3 class="font-display text-xl font-semibold text-secondary mb-3">Meet the team soon</h3>
				<p class="text-gray-500 max-w-md mx-auto">
					We're a growing team of performers, developers, and community builders.
					Full team profiles coming soon.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Stats Section -->
<section class="py-16 md:py-20 bg-white">
	<div class="container-wide">
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
			<div>
				<p class="text-4xl md:text-5xl font-bold text-primary mb-2">92%</p>
				<p class="text-gray-600 font-medium">To Performers</p>
			</div>
			<div>
				<p class="text-4xl md:text-5xl font-bold text-secondary mb-2">500+</p>
				<p class="text-gray-600 font-medium">Verified Performers</p>
			</div>
			<div>
				<p class="text-4xl md:text-5xl font-bold text-secondary mb-2">0%</p>
				<p class="text-gray-600 font-medium">Hidden Fees</p>
			</div>
			<div>
				<p class="text-4xl md:text-5xl font-bold text-secondary mb-2">100%</p>
				<p class="text-gray-600 font-medium">Community Owned</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-16 md:py-24 bg-gray-50">
	<div class="container-wide">
		<div class="bg-gradient-to-br from-secondary via-secondary to-gray-900 rounded-3xl p-8 md:p-16 text-center text-white overflow-hidden relative">
			<!-- Decorative elements -->
			<div class="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
			<div class="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

			<div class="relative z-10">
				<h2 class="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
					Ready to join the community?
				</h2>
				<p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
					Whether you're a performer looking to take control of your career, or a client
					seeking authentic talent - you belong here.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<a href="/auth/signup?type=performer" class="btn-primary btn-lg">
						Join as Performer
					</a>
					<a href="/performers" class="btn btn-lg bg-white/10 text-white hover:bg-white/20 border border-white/20">
						Browse Performers
					</a>
				</div>
				<p class="mt-6 text-gray-400 text-sm">
					Free to join. Only 8% platform fee when you book. No monthly costs.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Contact Teaser -->
<section class="py-12 md:py-16 bg-white border-t border-gray-100">
	<div class="container-wide">
		<div class="flex flex-col md:flex-row items-center justify-between gap-6">
			<div>
				<h3 class="font-display text-xl font-bold text-secondary mb-1">Have questions?</h3>
				<p class="text-gray-600">We'd love to hear from you. Reach out anytime.</p>
			</div>
			<a href="mailto:hello@ignitegigs.com" class="btn-secondary btn-lg">
				Contact Us
			</a>
		</div>
	</div>
</section>
