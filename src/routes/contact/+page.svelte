<script lang="ts">
	let name = $state('');
	let email = $state('');
	let subject = $state('General');
	let message = $state('');
	let isSubmitting = $state(false);
	let isSubmitted = $state(false);

	const subjects = ['General', 'Support', 'Partnerships', 'Feedback'];

	function handleSubmit(event: Event) {
		event.preventDefault();
		isSubmitting = true;

		// Simulate form submission delay
		setTimeout(() => {
			isSubmitting = false;
			isSubmitted = true;
			// Reset form
			name = '';
			email = '';
			subject = 'General';
			message = '';
		}, 1000);
	}

	let isFormValid = $derived(
		name.trim().length >= 2 &&
		email.includes('@') &&
		message.trim().length >= 10
	);
</script>

<svelte:head>
	<title>Contact Us - IgniteGigs</title>
	<meta name="description" content="Get in touch with the IgniteGigs team. We're here to help performers and clients succeed with bookings, support, and partnerships." />
	<meta property="og:title" content="Contact Us - IgniteGigs" />
	<meta property="og:description" content="Get in touch with the IgniteGigs team. We're here to help performers and clients succeed." />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Contact Us - IgniteGigs" />
	<meta name="twitter:description" content="Get in touch with the IgniteGigs team. We're here to help performers and clients succeed." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-secondary via-secondary to-gray-900 text-white">
	<div class="container-wide py-16 md:py-24">
		<div class="max-w-3xl mx-auto text-center">
			<h1 class="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
				Get in Touch
			</h1>
			<p class="text-lg md:text-xl text-gray-300">
				We're here to help performers and clients succeed
			</p>
		</div>
	</div>
</section>

<!-- Contact Options -->
<section class="py-16 bg-white">
	<div class="container-wide">
		<div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
			<!-- General Inquiries -->
			<div class="text-center p-8 rounded-card border border-gray-200 hover:border-primary hover:shadow-card transition-all">
				<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
				</div>
				<h3 class="font-display text-xl font-semibold text-secondary mb-2">General Inquiries</h3>
				<a href="mailto:hello@ignitegigs.com" class="text-primary hover:text-primary-hover font-medium block mb-2">
					hello@ignitegigs.com
				</a>
				<p class="text-sm text-gray-500">Response time: Within 24 hours</p>
			</div>

			<!-- Support -->
			<div class="text-center p-8 rounded-card border border-gray-200 hover:border-primary hover:shadow-card transition-all">
				<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
					</svg>
				</div>
				<h3 class="font-display text-xl font-semibold text-secondary mb-2">Support</h3>
				<a href="mailto:support@ignitegigs.com" class="text-primary hover:text-primary-hover font-medium block mb-2">
					support@ignitegigs.com
				</a>
				<p class="text-sm text-gray-500">For booking issues, payments, disputes</p>
			</div>

			<!-- Press & Partnerships -->
			<div class="text-center p-8 rounded-card border border-gray-200 hover:border-primary hover:shadow-card transition-all">
				<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
					</svg>
				</div>
				<h3 class="font-display text-xl font-semibold text-secondary mb-2">Press & Partnerships</h3>
				<a href="mailto:press@ignitegigs.com" class="text-primary hover:text-primary-hover font-medium block mb-2">
					press@ignitegigs.com
				</a>
				<p class="text-sm text-gray-500">For media inquiries, collaborations</p>
			</div>
		</div>
	</div>
</section>

<!-- Contact Form Section -->
<section class="py-16 bg-gray-50">
	<div class="container-wide">
		<div class="max-w-2xl mx-auto">
			<div class="text-center mb-10">
				<h2 class="font-display text-3xl font-bold text-secondary mb-4">Send Us a Message</h2>
				<p class="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
			</div>

			<div class="bg-white rounded-card shadow-card p-8">
				{#if isSubmitted}
					<div class="text-center py-8">
						<div class="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<h3 class="font-display text-2xl font-bold text-secondary mb-2">Message Sent!</h3>
						<p class="text-gray-600 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
						<button
							type="button"
							onclick={() => isSubmitted = false}
							class="btn-secondary btn-md"
						>
							Send Another Message
						</button>
					</div>
				{:else}
					<form onsubmit={handleSubmit} class="space-y-6">
						<!-- Name -->
						<div>
							<label for="name" class="label">Name <span class="text-error">*</span></label>
							<input
								id="name"
								type="text"
								required
								bind:value={name}
								class="input"
								placeholder="Your full name"
							/>
						</div>

						<!-- Email -->
						<div>
							<label for="email" class="label">Email <span class="text-error">*</span></label>
							<input
								id="email"
								type="email"
								required
								bind:value={email}
								class="input"
								placeholder="you@example.com"
							/>
						</div>

						<!-- Subject -->
						<div>
							<label for="subject" class="label">Subject</label>
							<select
								id="subject"
								bind:value={subject}
								class="input"
							>
								{#each subjects as subjectOption}
									<option value={subjectOption}>{subjectOption}</option>
								{/each}
							</select>
						</div>

						<!-- Message -->
						<div>
							<label for="message" class="label">Message <span class="text-error">*</span></label>
							<textarea
								id="message"
								required
								bind:value={message}
								rows="5"
								class="input min-h-[120px] resize-y"
								placeholder="How can we help you?"
							></textarea>
						</div>

						<!-- Submit -->
						<button
							type="submit"
							disabled={isSubmitting || !isFormValid}
							class="btn-primary btn-lg w-full"
						>
							{#if isSubmitting}
								<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Sending...
							{:else}
								Send Message
							{/if}
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
</section>

<!-- Quick Links & Social Media -->
<section class="py-16 bg-white">
	<div class="container-wide">
		<div class="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
			<!-- Quick Links -->
			<div>
				<h3 class="font-display text-xl font-bold text-secondary mb-6">Quick Links</h3>
				<div class="space-y-4">
					<a href="/faq" class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group">
						<div class="w-10 h-10 bg-gray-100 group-hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors">
							<svg class="w-5 h-5 text-gray-600 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<div>
							<span class="font-semibold text-secondary group-hover:text-primary block">FAQ</span>
							<span class="text-sm text-gray-500">Find answers to common questions</span>
						</div>
					</a>
					<a href="/trust-safety" class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group">
						<div class="w-10 h-10 bg-gray-100 group-hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors">
							<svg class="w-5 h-5 text-gray-600 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
						</div>
						<div>
							<span class="font-semibold text-secondary group-hover:text-primary block">Trust & Safety</span>
							<span class="text-sm text-gray-500">Report safety concerns</span>
						</div>
					</a>
				</div>
			</div>

			<!-- Social Media -->
			<div>
				<h3 class="font-display text-xl font-bold text-secondary mb-6">Follow Us</h3>
				<div class="space-y-4">
					<!-- Twitter/X -->
					<a href="https://twitter.com/ignitegigs" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group">
						<div class="w-10 h-10 bg-gray-100 group-hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors">
							<svg class="w-5 h-5 text-gray-600 group-hover:text-primary" fill="currentColor" viewBox="0 0 24 24">
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
							</svg>
						</div>
						<div>
							<span class="font-semibold text-secondary group-hover:text-primary block">Twitter / X</span>
							<span class="text-sm text-gray-500">@ignitegigs</span>
						</div>
					</a>

					<!-- Instagram -->
					<a href="https://instagram.com/ignitegigs" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group">
						<div class="w-10 h-10 bg-gray-100 group-hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors">
							<svg class="w-5 h-5 text-gray-600 group-hover:text-primary" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
							</svg>
						</div>
						<div>
							<span class="font-semibold text-secondary group-hover:text-primary block">Instagram</span>
							<span class="text-sm text-gray-500">@ignitegigs</span>
						</div>
					</a>

					<!-- TikTok -->
					<a href="https://tiktok.com/@ignitegigs" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group">
						<div class="w-10 h-10 bg-gray-100 group-hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors">
							<svg class="w-5 h-5 text-gray-600 group-hover:text-primary" fill="currentColor" viewBox="0 0 24 24">
								<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
							</svg>
						</div>
						<div>
							<span class="font-semibold text-secondary group-hover:text-primary block">TikTok</span>
							<span class="text-sm text-gray-500">@ignitegigs</span>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
