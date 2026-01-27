<script lang="ts">
	const careerIcons: Record<string, string> = {
		globe: 'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418',
		fire: 'M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z',
		target: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
		heart: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z',
		users: 'M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z',
		rocket: 'M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z'
	};

	const culturePoints = [
		{
			icon: 'globe',
			title: 'Remote-first culture',
			description: 'Work from anywhere in the world. We believe great work happens when you have flexibility.'
		},
		{
			icon: 'fire',
			title: 'Performer-founded company',
			description: 'Built by performers who understand the challenges of the entertainment industry.'
		},
		{
			icon: 'target',
			title: 'Mission-driven work',
			description: 'Every feature we build helps performers earn more and clients book better.'
		}
	];

	const values = [
		{
			icon: 'heart',
			title: 'Passion for creators',
			description: 'We genuinely care about helping performers succeed in their craft.'
		},
		{
			icon: 'users',
			title: 'Community-first mindset',
			description: 'Our community of performers drives everything we do and build.'
		},
		{
			icon: 'rocket',
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
							<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={careerIcons[point.icon]} />
							</svg>
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
							<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={careerIcons[value.icon]} />
							</svg>
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
