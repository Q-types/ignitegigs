<script lang="ts">
	let email = $state('');
	let subscribed = $state(false);
	let subscribing = $state(false);

	const topicIcons: Record<string, string> = {
		currency: 'M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
		sparkle: 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z',
		fire: 'M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z',
		star: 'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z',
		pencil: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
	};

	const upcomingTopics = [
		{
			icon: 'currency',
			title: 'How to price your performances',
			description: 'Learn strategies for setting rates that reflect your value'
		},
		{
			icon: 'sparkle',
			title: 'Building your brand as a performer',
			description: 'Stand out in a crowded market with authentic branding'
		},
		{
			icon: 'fire',
			title: 'Safety tips for fire performers',
			description: 'Essential guidelines to keep you and your audience safe'
		},
		{
			icon: 'star',
			title: 'Success stories from the community',
			description: 'Real performers sharing their journey and lessons learned'
		}
	];

	function handleSubscribe(e: Event) {
		e.preventDefault();
		if (!email) return;

		subscribing = true;

		// Simulate subscription (client-side only)
		setTimeout(() => {
			subscribed = true;
			subscribing = false;
		}, 1000);
	}
</script>

<svelte:head>
	<title>Blog - IgniteGigs | Tips & Stories for Performers</title>
	<meta
		name="description"
		content="Tips, stories, and insights for fire performers, LED artists, and circus entertainers. Learn how to grow your career and book more gigs."
	/>
	<meta property="og:title" content="IgniteGigs Blog - Tips & Stories for Performers" />
	<meta
		property="og:description"
		content="Tips, stories, and insights for fire performers, LED artists, and circus entertainers."
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="IgniteGigs Blog - Tips & Stories for Performers" />
	<meta
		name="twitter:description"
		content="Tips, stories, and insights for fire performers, LED artists, and circus entertainers."
	/>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Hero Section -->
	<section class="bg-gradient-to-br from-secondary via-secondary to-gray-900 text-white">
		<div class="container-wide py-16 md:py-24">
			<div class="text-center max-w-3xl mx-auto">
				<h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
					IgniteGigs <span class="text-primary">Blog</span>
				</h1>
				<p class="text-lg md:text-xl text-gray-300">
					Tips, stories, and insights for performers
				</p>
			</div>
		</div>
	</section>

	<!-- Coming Soon Section -->
	<section class="py-16 md:py-24">
		<div class="container-narrow">
			<div class="text-center mb-12">
				<!-- Illustration Placeholder -->
				<div class="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
					<svg class="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={topicIcons.pencil} />
					</svg>
				</div>

				<span class="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
					Coming Soon
				</span>

				<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
					We're working on amazing content for you
				</h2>
				<p class="text-gray-600 text-lg max-w-xl mx-auto">
					Our team is crafting valuable resources to help you grow your performance career.
					Be the first to know when we launch.
				</p>
			</div>

			<!-- Email Signup -->
			<div class="max-w-md mx-auto mb-16">
				{#if subscribed}
					<div class="bg-success-light border border-success/20 rounded-xl p-6 text-center">
						<div class="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
							<svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<h3 class="font-display text-lg font-semibold text-gray-900 mb-1">You're on the list!</h3>
						<p class="text-gray-600 text-sm">We'll notify you when the blog launches.</p>
					</div>
				{:else}
					<div class="bg-white rounded-xl p-6 shadow-card">
						<h3 class="font-display text-lg font-semibold text-secondary text-center mb-4">
							Be the first to know when we launch
						</h3>
						<form onsubmit={handleSubscribe} class="flex flex-col sm:flex-row gap-3">
							<input
								type="email"
								bind:value={email}
								placeholder="Enter your email"
								required
								class="input flex-1"
							/>
							<button
								type="submit"
								disabled={subscribing}
								class="btn-primary btn-md whitespace-nowrap"
							>
								{#if subscribing}
									<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Subscribing...
								{:else}
									Subscribe
								{/if}
							</button>
						</form>
						<p class="text-xs text-gray-500 text-center mt-3">
							No spam, ever. Unsubscribe anytime.
						</p>
					</div>
				{/if}
			</div>

			<!-- Upcoming Topics -->
			<div>
				<h3 class="font-display text-xl font-semibold text-secondary text-center mb-8">
					What we're writing about
				</h3>
				<div class="grid sm:grid-cols-2 gap-6">
					{#each upcomingTopics as topic}
						<div class="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
							<div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
								<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={topicIcons[topic.icon]} />
								</svg>
							</div>
							<h4 class="font-display text-lg font-semibold text-secondary mb-2">
								{topic.title}
							</h4>
							<p class="text-gray-600 text-sm">
								{topic.description}
							</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-16 bg-gray-100">
		<div class="container-wide">
			<div class="text-center">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					Can't wait? Start booking gigs today
				</h2>
				<p class="text-gray-600 mb-6">
					Join IgniteGigs and connect with clients looking for performers like you.
				</p>
				<a href="/auth/signup?type=performer" class="btn-primary btn-lg">
					Join as Performer
				</a>
			</div>
		</div>
	</section>
</div>
