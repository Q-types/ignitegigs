<script lang="ts">
	type FAQItem = {
		question: string;
		answer: string;
	};

	type FAQSection = {
		title: string;
		icon: string;
		items: FAQItem[];
	};

	const faqSections: FAQSection[] = [
		{
			title: 'For Performers',
			icon: '🔥',
			items: [
				{
					question: 'How do I sign up?',
					answer: 'Signing up is completely free and takes about 5 minutes. Just create an account, add your performance details, upload some photos or videos of your work, and set your rates. Once your profile is complete, you can start receiving booking requests right away.'
				},
				{
					question: 'How much does it cost?',
					answer: 'We charge just 8% when you book a gig — that\'s it. No monthly fees, no listing fees, no hidden charges. You only pay when you earn. Compare that to agencies who take 35-50% of every booking.'
				},
				{
					question: 'How do I get paid?',
					answer: 'Payments are processed securely through Stripe. After your event is completed, funds are released to your connected Stripe account within 2-3 business days. You\'ll receive the full amount minus our 8% platform fee.'
				},
				{
					question: 'Do I need insurance?',
					answer: 'Yes, all performers on IgniteGigs must have valid public liability insurance. This protects both you and your clients. You\'ll need to upload proof of insurance during registration, and we verify all documentation before your profile goes live.'
				},
				{
					question: 'What is the vouching system?',
					answer: 'The vouching system helps maintain quality in our community. Experienced performers can endorse newcomers they\'ve worked with, helping them build credibility faster. When you receive vouches from established performers, it signals to clients that you\'re trustworthy and skilled.'
				},
				{
					question: 'Can I set my own rates?',
					answer: 'Absolutely! You have full control over your pricing. Set your hourly rates, package prices, travel fees, and any other charges. You can also adjust rates for different types of events or offer special packages. No one tells you what to charge.'
				},
				{
					question: 'How do I handle cancellations?',
					answer: 'You set your own cancellation policy when creating your profile. You can choose how much notice you require and what percentage of the booking fee is refundable at different timeframes. Clients see your policy before booking, so expectations are clear from the start.'
				}
			]
		},
		{
			title: 'For Clients',
			icon: '🎪',
			items: [
				{
					question: 'How do I find a performer?',
					answer: 'Use our search to filter performers by location, date, and performance type (fire, LED, circus, etc.). Browse video portfolios to see their work, read verified reviews from past clients, and compare rates — all in one place.'
				},
				{
					question: 'Is payment secure?',
					answer: 'Yes, all payments are processed through Stripe, a world-leading payment platform trusted by millions of businesses. Your payment details are never stored on our servers, and all transactions are protected by Stripe\'s fraud prevention systems.'
				},
				{
					question: 'What if the performer cancels?',
					answer: 'If a performer cancels your booking, you receive a full refund immediately. We also help you find a replacement performer if needed. Performer cancellation rates are tracked and displayed on profiles, so you can book with confidence.'
				},
				{
					question: 'How does the deposit work?',
					answer: 'When you book, you pay a 25% deposit to secure the date. This deposit is held securely and counts toward your total. The remaining 75% is charged 7 days before your event. If you need to cancel, refunds follow the performer\'s cancellation policy.'
				},
				{
					question: 'Are performers insured?',
					answer: 'Yes, every performer on IgniteGigs must have verified public liability insurance. We check all documentation before approving profiles. You can request to see insurance certificates directly through the platform for your records.'
				},
				{
					question: 'Can I see reviews?',
					answer: 'Yes, and importantly, all reviews on IgniteGigs come from verified bookings only. This means every review is from a real client who actually booked and worked with that performer. No fake reviews, no paid testimonials — just honest feedback.'
				}
			]
		},
		{
			title: 'General',
			icon: '❓',
			items: [
				{
					question: 'What makes IgniteGigs different?',
					answer: 'IgniteGigs is performer-owned, meaning the platform exists to serve performers, not extract from them. Performers keep 92% of every booking (compared to 50-65% with agencies). We have no shareholders demanding profits — just a sustainable platform built by performers, for performers.'
				},
				{
					question: 'Is this an agency?',
					answer: 'No, we\'re a direct booking platform. Unlike agencies, we don\'t represent performers or take a cut of their work. We simply connect performers with clients and provide the tools for secure booking. Performers set their own rates, manage their own schedules, and communicate directly with clients.'
				},
				{
					question: 'How do I contact support?',
					answer: 'Our support team is here to help! You can reach us through the contact form on our website, email us at support@ignitegigs.com, or use the in-app messaging system. We aim to respond to all queries within 24 hours.'
				}
			]
		}
	];

	// Track which items are open by section and item index
	let openItems = $state<Record<string, boolean>>({});

	function toggleItem(sectionIndex: number, itemIndex: number) {
		const key = `${sectionIndex}-${itemIndex}`;
		openItems[key] = !openItems[key];
	}

	function isOpen(sectionIndex: number, itemIndex: number): boolean {
		return openItems[`${sectionIndex}-${itemIndex}`] ?? false;
	}
</script>

<svelte:head>
	<title>FAQ - IgniteGigs | Frequently Asked Questions</title>
	<meta name="description" content="Find answers to common questions about IgniteGigs. Learn how our performer-owned platform works for fire performers, LED artists, and event clients." />
	<meta name="keywords" content="IgniteGigs FAQ, fire performer questions, LED performer booking, performer marketplace help" />
	<meta property="og:title" content="FAQ - IgniteGigs | Frequently Asked Questions" />
	<meta property="og:description" content="Find answers to common questions about IgniteGigs. Learn how our performer-owned platform works." />
	<meta property="og:type" content="website" />
	<link rel="canonical" href="https://ignitegigs.com/faq" />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-secondary via-secondary to-gray-900 text-white py-16 md:py-20">
	<div class="container-wide">
		<div class="max-w-3xl">
			<h1 class="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
				Frequently Asked <span class="text-primary">Questions</span>
			</h1>
			<p class="text-lg md:text-xl text-gray-300">
				Everything you need to know about booking performers and getting booked on IgniteGigs.
			</p>
		</div>
	</div>
</section>

<!-- FAQ Sections -->
<section class="py-16 md:py-24">
	<div class="container-narrow">
		<div class="space-y-12">
			{#each faqSections as section, sectionIndex}
				<div>
					<!-- Section Header -->
					<div class="flex items-center gap-3 mb-6">
						<div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
							<span class="text-2xl">{section.icon}</span>
						</div>
						<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary">
							{section.title}
						</h2>
					</div>

					<!-- FAQ Items -->
					<div class="space-y-3">
						{#each section.items as item, itemIndex}
							{@const open = isOpen(sectionIndex, itemIndex)}
							<div class="border border-gray-200 rounded-card overflow-hidden bg-white">
								<button
									type="button"
									onclick={() => toggleItem(sectionIndex, itemIndex)}
									class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
									aria-expanded={open}
								>
									<span class="font-semibold text-secondary pr-4">{item.question}</span>
									<span
										class="flex-shrink-0 w-6 h-6 flex items-center justify-center text-primary transition-transform duration-200 {open ? 'rotate-180' : ''}"
									>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
											<path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
										</svg>
									</span>
								</button>
								{#if open}
									<div class="px-6 pb-4 animate-fade-in">
										<p class="text-gray-600 leading-relaxed">{item.answer}</p>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Still Have Questions CTA -->
<section class="py-16 md:py-24 bg-gray-50">
	<div class="container-wide">
		<div class="max-w-2xl mx-auto text-center">
			<h2 class="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
				Still have questions?
			</h2>
			<p class="text-lg text-gray-600 mb-8">
				Can't find what you're looking for? Our support team is happy to help.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/contact" class="btn-primary btn-lg">
					Contact Support
				</a>
				<a href="/performers" class="btn-secondary btn-lg">
					Browse Performers
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Quick Links -->
<section class="py-16 md:py-24">
	<div class="container-wide">
		<div class="grid md:grid-cols-3 gap-8">
			<a href="/auth/signup?type=performer" class="card-hover p-8 text-center group">
				<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
					<span class="text-3xl">🔥</span>
				</div>
				<h3 class="font-display text-xl font-semibold mb-2 text-secondary">Join as Performer</h3>
				<p class="text-gray-600">
					Sign up free and start getting bookings. Keep 92% of every gig.
				</p>
			</a>

			<a href="/performers" class="card-hover p-8 text-center group">
				<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
					<span class="text-3xl">🔍</span>
				</div>
				<h3 class="font-display text-xl font-semibold mb-2 text-secondary">Find Performers</h3>
				<p class="text-gray-600">
					Browse verified fire and LED performers for your next event.
				</p>
			</a>

			<a href="/auth/signup?type=client" class="card-hover p-8 text-center group">
				<div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
					<span class="text-3xl">🎉</span>
				</div>
				<h3 class="font-display text-xl font-semibold mb-2 text-secondary">Book for Events</h3>
				<p class="text-gray-600">
					Create an account to save favorites and manage bookings.
				</p>
			</a>
		</div>
	</div>
</section>
