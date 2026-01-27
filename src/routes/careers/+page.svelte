<script lang="ts">
	const culturePoints = [
		{
			icon: '🌍',
			title: 'Remote-first culture',
			description: 'Work from anywhere in the world. We believe great work happens when you have flexibility.'
		},
		{
			icon: '🔥',
			title: 'Performer-founded company',
			description: 'Built by performers who understand the challenges of the entertainment industry.'
		},
		{
			icon: '🎯',
			title: 'Mission-driven work',
			description: 'Every feature we build helps performers earn more and clients book better.'
		}
	];

	const values = [
		{
			icon: '❤️',
			title: 'Passion for creators',
			description: 'We genuinely care about helping performers succeed in their craft.'
		},
		{
			icon: '🤝',
			title: 'Community-first mindset',
			description: 'Our community of performers drives everything we do and build.'
		},
		{
			icon: '🚀',
			title: 'Startup mentality',
			description: 'Move fast, learn quickly, and embrace the adventure of building something new.'
		}
	];
</script>

<svelte:head>
	<title>Careers - IgniteGigs | Join Our Team</title>
	<meta
		name="description"
		content="Join the IgniteGigs team and help us empower performers worldwide. Remote-first, mission-driven, and performer-founded."
	/>
	<meta property="og:title" content="Careers at IgniteGigs - Join Our Team" />
	<meta
		property="og:description"
		content="Help us empower performers worldwide. Remote-first, mission-driven work."
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Careers at IgniteGigs - Join Our Team" />
	<meta
		name="twitter:description"
		content="Help us empower performers worldwide. Remote-first, mission-driven work."
	/>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Hero Section -->
	<section class="bg-gradient-to-br from-secondary via-secondary to-gray-900 text-white">
		<div class="container-wide py-16 md:py-24">
			<div class="text-center max-w-3xl mx-auto">
				<h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
					Join the <span class="text-primary">Team</span>
				</h1>
				<p class="text-lg md:text-xl text-gray-300">
					Help us empower performers worldwide
				</p>
			</div>
		</div>
	</section>

	<!-- About Working at IgniteGigs -->
	<section class="py-16 md:py-24">
		<div class="container-wide">
			<div class="text-center mb-12">
				<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
					About working at IgniteGigs
				</h2>
				<p class="text-gray-600 text-lg max-w-2xl mx-auto">
					We're building the future of the performer economy. Here's what makes us different.
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-8">
				{#each culturePoints as point}
					<div class="text-center p-6">
						<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
							<span class="text-3xl">{point.icon}</span>
						</div>
						<h3 class="font-display text-xl font-semibold text-secondary mb-2">
							{point.title}
						</h3>
						<p class="text-gray-600">
							{point.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Current Openings -->
	<section class="py-16 md:py-24 bg-white">
		<div class="container-narrow">
			<div class="text-center mb-12">
				<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
					Current Openings
				</h2>
			</div>

			<!-- No Open Positions State -->
			<div class="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
				<div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
					<span class="text-4xl">👀</span>
				</div>
				<h3 class="font-display text-xl font-semibold text-secondary mb-3">
					No open positions right now
				</h3>
				<p class="text-gray-600 mb-6 max-w-md mx-auto">
					But we're always looking for talented people who share our passion for empowering performers.
				</p>
				<a href="#spontaneous" class="btn-primary btn-md">
					Send Spontaneous Application
				</a>
			</div>
		</div>
	</section>

	<!-- What We Value -->
	<section class="py-16 md:py-24 bg-gray-50">
		<div class="container-wide">
			<div class="text-center mb-12">
				<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
					What We Value
				</h2>
				<p class="text-gray-600 text-lg max-w-2xl mx-auto">
					These are the qualities we look for in every team member.
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
				{#each values as value}
					<div class="bg-white rounded-xl p-6 shadow-card">
						<div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
							<span class="text-2xl">{value.icon}</span>
						</div>
						<h3 class="font-display text-lg font-semibold text-secondary mb-2">
							{value.title}
						</h3>
						<p class="text-gray-600 text-sm">
							{value.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Spontaneous Application -->
	<section id="spontaneous" class="py-16 md:py-24 bg-white">
		<div class="container-narrow">
			<div class="bg-gradient-to-br from-secondary via-secondary to-gray-900 rounded-3xl p-8 md:p-12 text-white text-center">
				<div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
					<span class="text-3xl">✉️</span>
				</div>
				<h2 class="font-display text-2xl md:text-3xl font-bold mb-4">
					Spontaneous Application
				</h2>
				<p class="text-gray-300 mb-8 max-w-lg mx-auto">
					Don't see a role that fits? We'd still love to hear from you. Tell us about yourself
					and how you'd contribute to our mission.
				</p>

				<div class="bg-white/10 backdrop-blur rounded-xl p-6 max-w-md mx-auto">
					<p class="text-sm text-gray-300 mb-2">Send your application to</p>
					<a
						href="mailto:careers@ignitegigs.com"
						class="text-xl font-semibold text-primary hover:text-primary-hover transition-colors"
					>
						careers@ignitegigs.com
					</a>
					<p class="text-sm text-gray-400 mt-4">
						Include your resume and a brief note about why you're excited about IgniteGigs.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Bottom CTA -->
	<section class="py-16 bg-gray-100">
		<div class="container-wide">
			<div class="text-center">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					Not looking for a job?
				</h2>
				<p class="text-gray-600 mb-6">
					Join IgniteGigs as a performer and start booking gigs directly.
				</p>
				<a href="/auth/signup?type=performer" class="btn-primary btn-lg">
					Join as Performer
				</a>
			</div>
		</div>
	</section>
</div>
