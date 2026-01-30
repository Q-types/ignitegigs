<script lang="ts">
	import SEO from '$components/SEO.svelte';
	import PerformerCard from '$components/performer/PerformerCard.svelte';

	let { data } = $props();

	let linkCopied = $state(false);
	let showMatchReasons = $state(true);

	function shareResults() {
		const url = window.location.href;
		navigator.clipboard.writeText(url).then(() => {
			linkCopied = true;
			setTimeout(() => {
				linkCopied = false;
			}, 2000);
		});
	}

	// Vibe emoji mapping for visual flair
	const vibeEmoji: Record<string, string> = {
		'elegant & sophisticated': '🕯️',
		'fun & lively': '🎉',
		'high energy & wild': '🔥',
		'mysterious & enchanting': '🌙'
	};

	let vibeIcon = $derived(vibeEmoji[data.summary.vibe] || '✨');
</script>

<SEO
	title="Your Perfect Performers - Quiz Results"
	description="Personalised performer recommendations based on your event preferences."
/>

<div class="min-h-[calc(100vh-4rem)]">
	<!-- Results Header -->
	<section class="bg-gradient-to-br from-secondary via-[#1a1a2e] to-[#16162a] text-white py-12 md:py-16">
		<div class="container-wide">
			<div class="max-w-3xl mx-auto text-center">
				<!-- Animated sparkle -->
				<div class="text-5xl mb-4 animate-fade-in">{vibeIcon}</div>

				<h1 class="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
					Your Perfect Performers
				</h1>

				<p class="text-lg md:text-xl text-gray-300 mb-6 animate-fade-in">
					{data.summary.text}
				</p>

				<!-- Quiz answer pills -->
				<div class="flex flex-wrap items-center justify-center gap-2 mb-8 animate-fade-in">
					{#if data.quizAnswers.occasion}
						<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-sm text-gray-200 border border-white/10">
							{data.summary.occasion}
						</span>
					{/if}
					{#if data.quizAnswers.vibe}
						<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 text-sm text-primary border border-primary/20">
							{data.summary.vibe}
						</span>
					{/if}
					{#if data.quizAnswers.guestCount}
						<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-sm text-gray-200 border border-white/10">
							{data.summary.guestCount} guests
						</span>
					{/if}
				</div>

				<!-- Actions -->
				<div class="flex flex-wrap items-center justify-center gap-3 animate-fade-in">
					<a href="/discover" class="btn-secondary btn-md">
						<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						Retake Quiz
					</a>
					<button
						onclick={shareResults}
						class="btn-ghost btn-md text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400"
					>
						{#if linkCopied}
							<svg class="w-4 h-4 mr-1.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Link Copied!
						{:else}
							<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
							</svg>
							Share Results
						{/if}
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- Results Grid -->
	<section class="py-10 md:py-14 bg-gray-50">
		<div class="container-wide">
			{#if data.performers.length > 0}
				<!-- Match count -->
				<div class="flex items-center justify-between mb-6">
					<p class="text-gray-600">
						<span class="font-semibold text-secondary">{data.totalCount}</span>
						{data.totalCount === 1 ? 'performer matches' : 'performers matched'} your vibe
					</p>
					<a href="/performers" class="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
						Browse all performers &rarr;
					</a>
				</div>

				<!-- Performer Grid with Match Reasons -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each data.performers as performer (performer.id)}
						<div class="relative">
							<!-- Match reason badge -->
							{#if showMatchReasons && performer.match_reason}
								<div class="absolute -top-2 left-3 right-3 z-10">
									<div class="bg-secondary text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 w-fit max-w-full">
										<svg class="w-3.5 h-3.5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171.932-.53 1.362l3.62 3.06-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.063 2.154c.714.436 1.6-.207 1.404-1.02l-1.106-4.637 3.62-3.06c.642-.43.304-1.295-.53-1.362l-4.752-.38-1.831-4.402z" clip-rule="evenodd" />
										</svg>
										<span class="truncate">{performer.match_reason}</span>
									</div>
								</div>
							{/if}

							<div class="pt-3">
								<PerformerCard {performer} />
							</div>
						</div>
					{/each}
				</div>

				<!-- Bottom CTA -->
				<div class="mt-12 text-center">
					<p class="text-gray-500 mb-4">
						Want to explore more options?
					</p>
					<a href="/performers" class="btn-primary btn-lg">
						Browse All Performers
					</a>
				</div>

			{:else}
				<!-- Empty State -->
				<div class="max-w-lg mx-auto text-center py-16">
					<div class="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
						<span class="text-3xl">🔍</span>
					</div>
					<h2 class="font-display text-2xl font-bold text-secondary mb-3">
						No exact matches found
					</h2>
					<p class="text-gray-500 mb-6">
						We could not find performers that match all your criteria right now.
						Try broadening your preferences or browse our full catalogue.
					</p>
					<div class="flex flex-col sm:flex-row items-center justify-center gap-3">
						<a href="/discover" class="btn-primary btn-lg w-full sm:w-auto">
							<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
							Retake Quiz
						</a>
						<a href="/performers" class="btn-secondary btn-lg w-full sm:w-auto">
							Browse All Performers
						</a>
					</div>
				</div>
			{/if}
		</div>
	</section>
</div>
