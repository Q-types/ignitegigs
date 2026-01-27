<script lang="ts">
	const effectiveDate = '[EFFECTIVE DATE]';
	const lastUpdated = '[LAST UPDATED]';
</script>

<svelte:head>
	<title>Terms of Service - IgniteGigs</title>
	<meta
		name="description"
		content="Read the Terms of Service for IgniteGigs, the UK marketplace connecting fire and LED performers with event clients. Understand your rights and obligations."
	/>
	<meta property="og:title" content="Terms of Service - IgniteGigs" />
	<meta
		property="og:description"
		content="Terms of Service for IgniteGigs - the performer-owned marketplace for fire and LED entertainment."
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Terms of Service - IgniteGigs" />
	<link rel="canonical" href="https://ignitegigs.com/terms" />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-secondary via-secondary to-gray-900 text-white">
	<div class="container-wide py-16 md:py-20">
		<div class="max-w-3xl">
			<div class="flex items-center gap-3 mb-6">
				<div class="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
					<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>
				<span class="text-primary font-semibold text-sm uppercase tracking-wide">Legal</span>
			</div>
			<h1 class="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
				Terms of <span class="text-primary">Service</span>
			</h1>
			<p class="text-lg text-gray-300 mb-6">
				Please read these terms carefully before using the IgniteGigs platform.
			</p>
			<div class="flex flex-wrap gap-4 text-sm text-gray-400">
				<span>Effective Date: {effectiveDate}</span>
				<span class="hidden sm:inline">|</span>
				<span>Last Updated: {lastUpdated}</span>
			</div>
		</div>
	</div>
</section>

<!-- Table of Contents -->
<section class="py-8 bg-gray-50 border-b border-gray-200 sticky top-0 z-20">
	<div class="container-wide">
		<details class="md:hidden">
			<summary class="font-semibold text-secondary cursor-pointer">Table of Contents</summary>
			<nav class="mt-4 space-y-2">
				<a href="#agreement" class="block text-gray-600 hover:text-primary text-sm">1. Agreement to Terms</a>
				<a href="#definitions" class="block text-gray-600 hover:text-primary text-sm">2. Definitions</a>
				<a href="#registration" class="block text-gray-600 hover:text-primary text-sm">3. Account Registration</a>
				<a href="#platform-services" class="block text-gray-600 hover:text-primary text-sm">4. Platform Services</a>
				<a href="#performer-obligations" class="block text-gray-600 hover:text-primary text-sm">5. Performer Obligations</a>
				<a href="#client-obligations" class="block text-gray-600 hover:text-primary text-sm">6. Client Obligations</a>
				<a href="#booking-process" class="block text-gray-600 hover:text-primary text-sm">7. Booking Process</a>
				<a href="#fees-payments" class="block text-gray-600 hover:text-primary text-sm">8. Fees and Payments</a>
				<a href="#cancellation" class="block text-gray-600 hover:text-primary text-sm">9. Cancellation and Refunds</a>
				<a href="#intellectual-property" class="block text-gray-600 hover:text-primary text-sm">10. Intellectual Property</a>
				<a href="#prohibited-conduct" class="block text-gray-600 hover:text-primary text-sm">11. Prohibited Conduct</a>
				<a href="#dispute-resolution" class="block text-gray-600 hover:text-primary text-sm">12. Dispute Resolution</a>
				<a href="#liability" class="block text-gray-600 hover:text-primary text-sm">13. Limitation of Liability</a>
				<a href="#indemnification" class="block text-gray-600 hover:text-primary text-sm">14. Indemnification</a>
				<a href="#warranties" class="block text-gray-600 hover:text-primary text-sm">15. Disclaimer of Warranties</a>
				<a href="#termination" class="block text-gray-600 hover:text-primary text-sm">16. Termination</a>
				<a href="#governing-law" class="block text-gray-600 hover:text-primary text-sm">17. Governing Law</a>
				<a href="#changes" class="block text-gray-600 hover:text-primary text-sm">18. Changes to Terms</a>
				<a href="#severability" class="block text-gray-600 hover:text-primary text-sm">19. Severability</a>
				<a href="#contact" class="block text-gray-600 hover:text-primary text-sm">20. Contact Information</a>
			</nav>
		</details>
		<nav class="hidden md:flex flex-wrap gap-x-6 gap-y-2 text-sm">
			<a href="#agreement" class="text-gray-600 hover:text-primary">1. Agreement</a>
			<a href="#definitions" class="text-gray-600 hover:text-primary">2. Definitions</a>
			<a href="#registration" class="text-gray-600 hover:text-primary">3. Registration</a>
			<a href="#platform-services" class="text-gray-600 hover:text-primary">4. Services</a>
			<a href="#performer-obligations" class="text-gray-600 hover:text-primary">5. Performer Obligations</a>
			<a href="#client-obligations" class="text-gray-600 hover:text-primary">6. Client Obligations</a>
			<a href="#booking-process" class="text-gray-600 hover:text-primary">7. Bookings</a>
			<a href="#fees-payments" class="text-gray-600 hover:text-primary">8. Payments</a>
			<a href="#cancellation" class="text-gray-600 hover:text-primary">9. Cancellations</a>
			<a href="#intellectual-property" class="text-gray-600 hover:text-primary">10. IP</a>
			<a href="#prohibited-conduct" class="text-gray-600 hover:text-primary">11. Prohibited Conduct</a>
			<a href="#dispute-resolution" class="text-gray-600 hover:text-primary">12. Disputes</a>
			<a href="#liability" class="text-gray-600 hover:text-primary">13. Liability</a>
			<a href="#indemnification" class="text-gray-600 hover:text-primary">14. Indemnification</a>
			<a href="#warranties" class="text-gray-600 hover:text-primary">15. Warranties</a>
			<a href="#termination" class="text-gray-600 hover:text-primary">16. Termination</a>
			<a href="#governing-law" class="text-gray-600 hover:text-primary">17. Governing Law</a>
			<a href="#changes" class="text-gray-600 hover:text-primary">18. Changes</a>
			<a href="#severability" class="text-gray-600 hover:text-primary">19. Severability</a>
			<a href="#contact" class="text-gray-600 hover:text-primary">20. Contact</a>
		</nav>
	</div>
</section>

<!-- Terms Content -->
<section class="py-12 md:py-16">
	<div class="container-narrow">
		<div class="prose prose-lg max-w-none">
			<!-- 1. Agreement to Terms -->
			<article id="agreement" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					1. Agreement to Terms
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">1.1</strong> These Terms of Service ("Terms") constitute a legally binding agreement between you and IgniteGigs Ltd ("IgniteGigs", "we", "us", or "our"), a company registered in England and Wales, governing your access to and use of the IgniteGigs platform, website, mobile applications, and related services (collectively, the "Platform").
					</p>
					<p>
						<strong class="text-secondary">1.2</strong> By accessing or using the Platform, creating an account, or completing a booking, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Platform.
					</p>
					<p>
						<strong class="text-secondary">1.3</strong> These Terms apply to all users of the Platform, including Performers, Clients, and visitors. Additional terms may apply to specific features or services, which will be disclosed at the time of use.
					</p>
					<p>
						<strong class="text-secondary">1.4</strong> We reserve the right to update these Terms at any time. Continued use of the Platform following any changes constitutes acceptance of the revised Terms.
					</p>
				</div>
			</article>

			<!-- 2. Definitions -->
			<article id="definitions" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					2. Definitions
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>For the purposes of these Terms, the following definitions apply:</p>
					<div class="space-y-4 mt-4">
						<div class="border-l-4 border-primary pl-4">
							<p><strong class="text-secondary">"Platform"</strong> means the IgniteGigs website, mobile applications, APIs, and all related services, tools, and features provided by IgniteGigs.</p>
						</div>
						<div class="border-l-4 border-primary pl-4">
							<p><strong class="text-secondary">"Performer"</strong> means any individual or entity registered on the Platform to offer entertainment services, including but not limited to fire performance, LED performance, circus arts, and related entertainment acts.</p>
						</div>
						<div class="border-l-4 border-primary pl-4">
							<p><strong class="text-secondary">"Client"</strong> means any individual or entity registered on the Platform to search for, communicate with, and book Performers for events.</p>
						</div>
						<div class="border-l-4 border-primary pl-4">
							<p><strong class="text-secondary">"Booking"</strong> means a confirmed engagement between a Client and a Performer for the provision of Services at a specified event, including all agreed terms, dates, times, locations, and fees.</p>
						</div>
						<div class="border-l-4 border-primary pl-4">
							<p><strong class="text-secondary">"Services"</strong> means the entertainment services provided by Performers to Clients, as described in the Performer's profile and agreed upon in a Booking.</p>
						</div>
						<div class="border-l-4 border-primary pl-4">
							<p><strong class="text-secondary">"User"</strong> means any person who accesses or uses the Platform, including Performers, Clients, and visitors.</p>
						</div>
						<div class="border-l-4 border-primary pl-4">
							<p><strong class="text-secondary">"Content"</strong> means any text, images, videos, audio, graphics, or other materials uploaded, posted, or transmitted through the Platform.</p>
						</div>
						<div class="border-l-4 border-primary pl-4">
							<p><strong class="text-secondary">"Platform Fee"</strong> means the commission charged by IgniteGigs for facilitating Bookings, currently set at eight percent (8%) of the total Booking value.</p>
						</div>
					</div>
				</div>
			</article>

			<!-- 3. Account Registration -->
			<article id="registration" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					3. Account Registration
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">3.1 Eligibility.</strong> To create an account on the Platform, you must be at least eighteen (18) years of age and have the legal capacity to enter into binding contracts under applicable law. By registering, you represent and warrant that you meet these requirements.
					</p>
					<p>
						<strong class="text-secondary">3.2 Accurate Information.</strong> You agree to provide accurate, current, and complete information during the registration process and to update such information as necessary to maintain its accuracy. You must not provide false, misleading, or fraudulent information.
					</p>
					<p>
						<strong class="text-secondary">3.3 Account Security.</strong> You are responsible for maintaining the confidentiality of your account credentials, including your password. You agree to:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Create a strong, unique password for your account</li>
						<li>Not share your account credentials with any third party</li>
						<li>Immediately notify us of any unauthorised access or security breach</li>
						<li>Accept responsibility for all activities that occur under your account</li>
					</ul>
					<p>
						<strong class="text-secondary">3.4 One Account Per Person.</strong> Each individual may maintain only one account on the Platform. Creating multiple accounts may result in termination of all associated accounts.
					</p>
					<p>
						<strong class="text-secondary">3.5 Verification.</strong> We may require verification of your identity, insurance, qualifications, or other information. Failure to provide requested verification may result in account suspension or termination.
					</p>
				</div>
			</article>

			<!-- 4. Platform Services -->
			<article id="platform-services" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					4. Platform Services Description
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">4.1 Marketplace Function.</strong> IgniteGigs operates as an online marketplace connecting Performers with Clients. We provide the technology platform and tools to facilitate these connections but are not a party to the contracts formed between Performers and Clients.
					</p>
					<p>
						<strong class="text-secondary">4.2 Platform Features.</strong> The Platform provides the following services:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Profile hosting for Performers to showcase their services, media, and credentials</li>
						<li>Search and discovery tools for Clients to find suitable Performers</li>
						<li>Secure messaging between Performers and Clients</li>
						<li>Booking management and calendar tools</li>
						<li>Secure payment processing via Stripe</li>
						<li>Review and rating systems</li>
						<li>Community vouching system for trust verification</li>
						<li>Insurance verification services</li>
					</ul>
					<p>
						<strong class="text-secondary">4.3 No Employment Relationship.</strong> IgniteGigs does not employ Performers. Performers are independent contractors who operate their own businesses. Nothing in these Terms creates an employment, agency, partnership, or joint venture relationship between IgniteGigs and any User.
					</p>
					<p>
						<strong class="text-secondary">4.4 Service Availability.</strong> We strive to maintain continuous Platform availability but do not guarantee uninterrupted access. We may modify, suspend, or discontinue any aspect of the Platform at any time without prior notice.
					</p>
				</div>
			</article>

			<!-- 5. Performer Obligations -->
			<article id="performer-obligations" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					5. Performer Obligations
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">5.1 Profile Accuracy.</strong> Performers must maintain accurate and up-to-date profiles, including:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Truthful descriptions of their acts, skills, and experience</li>
						<li>Accurate pricing information</li>
						<li>Current availability and location information</li>
						<li>Authentic photos and videos of their actual performances</li>
					</ul>
					<p>
						<strong class="text-secondary">5.2 Insurance Requirements.</strong> All Performers offering fire performance or other high-risk entertainment must maintain valid public liability insurance with coverage of at least five million pounds (GBP 5,000,000). Performers must:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Upload proof of current insurance during registration</li>
						<li>Maintain continuous insurance coverage while active on the Platform</li>
						<li>Update insurance documentation before policies expire</li>
						<li>Provide insurance certificates to Clients upon reasonable request</li>
					</ul>
					<p>
						<strong class="text-secondary">5.3 Professional Conduct.</strong> Performers agree to:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Perform all confirmed Bookings professionally and to the agreed standard</li>
						<li>Arrive punctually and prepared with appropriate equipment</li>
						<li>Conduct themselves professionally when representing themselves on the Platform</li>
						<li>Communicate promptly and courteously with Clients</li>
						<li>Comply with all applicable health and safety regulations</li>
						<li>Obtain necessary permits and comply with venue requirements</li>
					</ul>
					<p>
						<strong class="text-secondary">5.4 Cancellation Policy.</strong> Performers must establish and honour their stated cancellation policies. Performers who cancel confirmed Bookings may face penalties including:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Negative impact on profile visibility and search ranking</li>
						<li>Display of cancellation statistics on their profile</li>
						<li>Account suspension or termination for repeated cancellations</li>
					</ul>
					<p>
						<strong class="text-secondary">5.5 Tax Responsibilities.</strong> Performers are solely responsible for reporting and paying all applicable taxes on income earned through the Platform, including income tax, National Insurance contributions, and VAT where applicable.
					</p>
				</div>
			</article>

			<!-- 6. Client Obligations -->
			<article id="client-obligations" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					6. Client Obligations
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">6.1 Accurate Event Information.</strong> Clients must provide accurate and complete information about their events, including:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Correct date, time, and duration of the event</li>
						<li>Accurate venue address and access information</li>
						<li>Nature and type of event</li>
						<li>Expected audience size and composition</li>
						<li>Any relevant venue restrictions or requirements</li>
						<li>Special requirements or requests</li>
					</ul>
					<p>
						<strong class="text-secondary">6.2 Payment Terms.</strong> Clients agree to:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Pay the required deposit (25% of total Booking value) at the time of Booking confirmation</li>
						<li>Pay the remaining balance (75% of total Booking value) seven (7) days prior to the event date</li>
						<li>Provide valid payment information and authorise charges as required</li>
						<li>Pay any additional fees agreed with the Performer (travel expenses, equipment, etc.)</li>
					</ul>
					<p>
						<strong class="text-secondary">6.3 Cancellation Responsibilities.</strong> Clients must review and understand the Performer's cancellation policy before confirming a Booking. Cancellation refunds are subject to the Performer's stated policy and the timing of the cancellation.
					</p>
					<p>
						<strong class="text-secondary">6.4 Venue and Safety.</strong> Clients are responsible for:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Ensuring the venue is suitable and safe for the booked performance</li>
						<li>Obtaining necessary permissions from venue owners for fire or other specialised performances</li>
						<li>Providing adequate performance space as specified by the Performer</li>
						<li>Ensuring appropriate fire safety equipment is available where required</li>
					</ul>
				</div>
			</article>

			<!-- 7. Booking Process -->
			<article id="booking-process" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					7. Booking Process and Contract Formation
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">7.1 Booking Request.</strong> A Client may submit a Booking request to a Performer through the Platform, specifying event details and requirements. A Booking request does not constitute a binding contract.
					</p>
					<p>
						<strong class="text-secondary">7.2 Performer Acceptance.</strong> Upon receiving a Booking request, the Performer may accept, decline, or propose modifications. The Performer should respond to all Booking requests within forty-eight (48) hours.
					</p>
					<p>
						<strong class="text-secondary">7.3 Contract Formation.</strong> A binding contract between the Performer and Client is formed when:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>The Performer accepts the Booking request</li>
						<li>The Client successfully pays the required deposit</li>
						<li>Both parties receive confirmation from the Platform</li>
					</ul>
					<p>
						<strong class="text-secondary">7.4 Direct Contract.</strong> The contract for Services is directly between the Performer and Client. IgniteGigs facilitates this contract but is not a party to it. We are not responsible for the performance of Services or the conduct of either party.
					</p>
					<p>
						<strong class="text-secondary">7.5 Booking Modifications.</strong> Any modifications to a confirmed Booking must be agreed upon by both the Performer and Client through the Platform. Price adjustments may apply based on the nature of the modification.
					</p>
					<p>
						<strong class="text-secondary">7.6 Off-Platform Agreements.</strong> Users are prohibited from circumventing the Platform to avoid fees. Any agreements made outside the Platform will not be protected by our payment protection, dispute resolution, or other services.
					</p>
				</div>
			</article>

			<!-- 8. Fees and Payments -->
			<article id="fees-payments" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					8. Fees and Payments
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">8.1 Platform Fee.</strong> IgniteGigs charges a Platform Fee of eight percent (8%) on all completed Bookings. This fee is deducted from the Performer's payout and covers:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Platform hosting and maintenance</li>
						<li>Profile and media hosting</li>
						<li>Booking management tools</li>
						<li>Customer support services</li>
						<li>Payment processing infrastructure</li>
						<li>Marketing and platform development</li>
					</ul>
					<p>
						<strong class="text-secondary">8.2 Payment Processing.</strong> All payments are processed securely through Stripe. Standard Stripe payment processing fees apply (approximately 1.5% + 20p per transaction for UK cards). These fees are separate from and in addition to the Platform Fee.
					</p>
					<p>
						<strong class="text-secondary">8.3 Payment Schedule.</strong>
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li><strong>Deposit:</strong> 25% of the total Booking value is charged when the Booking is confirmed</li>
						<li><strong>Balance:</strong> The remaining 75% is charged seven (7) days before the event date</li>
						<li><strong>Late Bookings:</strong> For Bookings made within seven (7) days of the event, full payment is required at confirmation</li>
					</ul>
					<p>
						<strong class="text-secondary">8.4 Payout Timing.</strong> Performers receive payouts via their connected Stripe account within two to three (2-3) business days following successful completion of the event. Payouts include the Booking amount minus the Platform Fee and any applicable Stripe fees.
					</p>
					<p>
						<strong class="text-secondary">8.5 Currency.</strong> All transactions on the Platform are conducted in British Pounds Sterling (GBP).
					</p>
					<p>
						<strong class="text-secondary">8.6 Fee Changes.</strong> We reserve the right to modify our fee structure with thirty (30) days' advance notice. Changes will not affect confirmed Bookings made prior to the effective date of any fee change.
					</p>
				</div>
			</article>

			<!-- 9. Cancellation and Refunds -->
			<article id="cancellation" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					9. Cancellation and Refund Policy
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">9.1 Performer Cancellation Policy.</strong> Each Performer sets their own cancellation policy, which must be clearly displayed on their profile. Clients should review this policy carefully before confirming a Booking.
					</p>
					<p>
						<strong class="text-secondary">9.2 Client Cancellations.</strong> When a Client cancels a Booking:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Refunds are calculated according to the Performer's stated cancellation policy</li>
						<li>The Performer retains any non-refundable portion as specified in their policy</li>
						<li>IgniteGigs retains its Platform Fee on the non-refundable portion</li>
						<li>Refunds are processed within five to ten (5-10) business days</li>
					</ul>
					<p>
						<strong class="text-secondary">9.3 Performer Cancellations.</strong> If a Performer cancels a confirmed Booking:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>The Client receives a full refund of all payments made</li>
						<li>The cancellation is recorded on the Performer's profile</li>
						<li>Repeated cancellations may result in account penalties or termination</li>
					</ul>
					<p>
						<strong class="text-secondary">9.4 Force Majeure.</strong> Neither party shall be liable for cancellations caused by events beyond their reasonable control, including natural disasters, severe weather conditions, government actions, civil unrest, or other force majeure events. In such cases, we will work with both parties to reach a fair resolution.
					</p>
					<p>
						<strong class="text-secondary">9.5 No-Show Policy.</strong>
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>If a Performer fails to appear for a confirmed Booking without notice, the Client receives a full refund and the Performer's account may be suspended</li>
						<li>If a Client cancels or is unavailable on the event date without proper notice, the Performer retains the full Booking amount</li>
					</ul>
					<p>
						<strong class="text-secondary">9.6 Dispute Resolution for Cancellations.</strong> Disputes regarding cancellations will be handled through our dispute resolution process as outlined in Section 12.
					</p>
				</div>
			</article>

			<!-- 10. Intellectual Property -->
			<article id="intellectual-property" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					10. Intellectual Property
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">10.1 User Content Licence.</strong> By uploading, posting, or transmitting Content to the Platform, you grant IgniteGigs a non-exclusive, worldwide, royalty-free, sublicensable licence to use, reproduce, modify, adapt, publish, display, and distribute such Content for the purpose of operating, promoting, and improving the Platform. This licence continues even after account termination for Content that remains on the Platform.
					</p>
					<p>
						<strong class="text-secondary">10.2 User Content Ownership.</strong> You retain all ownership rights in your Content. You represent and warrant that:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>You own or have the necessary rights to use and authorise the use of all Content you upload</li>
						<li>Your Content does not infringe the intellectual property rights of any third party</li>
						<li>You have obtained necessary consents from individuals appearing in your Content</li>
					</ul>
					<p>
						<strong class="text-secondary">10.3 Platform Intellectual Property.</strong> The Platform, including its design, features, functionality, code, graphics, logos, and trademarks, is the exclusive property of IgniteGigs and is protected by copyright, trademark, and other intellectual property laws. You may not:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Copy, modify, or create derivative works of the Platform</li>
						<li>Reverse engineer or attempt to extract source code</li>
						<li>Use our trademarks or branding without written permission</li>
						<li>Remove or alter any copyright or proprietary notices</li>
					</ul>
					<p>
						<strong class="text-secondary">10.4 Feedback.</strong> Any suggestions, ideas, or feedback you provide regarding the Platform may be used by IgniteGigs without compensation or attribution to you.
					</p>
					<p>
						<strong class="text-secondary">10.5 DMCA and Takedown Requests.</strong> We respect intellectual property rights and will respond to valid takedown requests. If you believe Content on the Platform infringes your rights, please contact us with details of the alleged infringement.
					</p>
				</div>
			</article>

			<!-- 11. Prohibited Conduct -->
			<article id="prohibited-conduct" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					11. Prohibited Conduct
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">11.1</strong> Users agree not to engage in any of the following prohibited activities:
					</p>
					<p><strong class="text-secondary">Platform Integrity:</strong></p>
					<ul class="list-disc pl-6 space-y-2 mb-4">
						<li>Creating false or misleading accounts or profiles</li>
						<li>Impersonating another person or entity</li>
						<li>Manipulating reviews, ratings, or the vouching system</li>
						<li>Using automated systems, bots, or scrapers to access the Platform</li>
						<li>Circumventing security features or access controls</li>
						<li>Interfering with the proper functioning of the Platform</li>
					</ul>
					<p><strong class="text-secondary">Commercial Integrity:</strong></p>
					<ul class="list-disc pl-6 space-y-2 mb-4">
						<li>Circumventing the Platform to avoid fees</li>
						<li>Soliciting off-platform payments for Bookings initiated through the Platform</li>
						<li>Engaging in fraudulent financial activities</li>
						<li>Advertising competing services on the Platform</li>
					</ul>
					<p><strong class="text-secondary">Legal Compliance:</strong></p>
					<ul class="list-disc pl-6 space-y-2 mb-4">
						<li>Violating any applicable laws, regulations, or third-party rights</li>
						<li>Engaging in discrimination based on protected characteristics</li>
						<li>Promoting or engaging in illegal activities</li>
						<li>Uploading Content that is defamatory, obscene, or harmful</li>
					</ul>
					<p><strong class="text-secondary">User Conduct:</strong></p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Harassing, threatening, or intimidating other Users</li>
						<li>Sending spam or unsolicited communications</li>
						<li>Sharing another User's personal information without consent</li>
						<li>Engaging in any conduct that could harm the Platform's reputation</li>
					</ul>
					<p class="mt-4">
						<strong class="text-secondary">11.2</strong> Violation of these prohibitions may result in immediate account suspension or termination, forfeiture of pending payments, and legal action where appropriate.
					</p>
				</div>
			</article>

			<!-- 12. Dispute Resolution -->
			<article id="dispute-resolution" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					12. Dispute Resolution
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">12.1 Between Users.</strong> Disputes arising between Performers and Clients should first be addressed through direct communication via the Platform's messaging system. We encourage good-faith negotiation to resolve issues amicably.
					</p>
					<p>
						<strong class="text-secondary">12.2 Platform Mediation.</strong> If direct resolution fails, either party may request Platform mediation by:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Submitting a dispute through the Booking dashboard within fourteen (14) days of the event</li>
						<li>Providing all relevant documentation and evidence</li>
						<li>Cooperating fully with our investigation</li>
					</ul>
					<p>
						<strong class="text-secondary">12.3 Mediation Process.</strong> Upon receiving a dispute:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Our support team will acknowledge receipt within forty-eight (48) hours</li>
						<li>Both parties will be invited to provide their account of events</li>
						<li>We will review all available evidence, including messages, Booking details, and any supporting documentation</li>
						<li>A decision will be communicated within five (5) business days</li>
					</ul>
					<p>
						<strong class="text-secondary">12.4 Binding Decision.</strong> Our mediation decision is final regarding any Platform-related remedies, including refund determinations. This does not prevent either party from pursuing legal remedies for matters outside the scope of Platform mediation.
					</p>
					<p>
						<strong class="text-secondary">12.5 Disputes with IgniteGigs.</strong> Any disputes between Users and IgniteGigs regarding these Terms shall be resolved through good-faith negotiation. If negotiation fails, disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
					</p>
				</div>
			</article>

			<!-- 13. Limitation of Liability -->
			<article id="liability" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					13. Limitation of Liability
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">13.1 Platform Role.</strong> IgniteGigs provides a platform to connect Performers and Clients. We are not responsible for the quality, safety, legality, or any other aspect of the Services provided by Performers.
					</p>
					<p>
						<strong class="text-secondary">13.2 Exclusion of Liability.</strong> To the maximum extent permitted by applicable law, IgniteGigs, its directors, employees, agents, and affiliates shall not be liable for:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Any indirect, incidental, special, consequential, or punitive damages</li>
						<li>Loss of profits, revenue, data, or business opportunities</li>
						<li>Personal injury or property damage arising from Services provided by Performers</li>
						<li>The conduct, acts, or omissions of any User</li>
						<li>Any third-party content or services accessed through the Platform</li>
						<li>Technical failures, interruptions, or errors in the Platform</li>
					</ul>
					<p>
						<strong class="text-secondary">13.3 Maximum Liability.</strong> In any event, our total aggregate liability arising from or related to these Terms or your use of the Platform shall not exceed the greater of: (a) the total Platform Fees paid by or to you in the twelve (12) months preceding the claim; or (b) one hundred pounds (GBP 100).
					</p>
					<p>
						<strong class="text-secondary">13.4 Essential Basis.</strong> The limitations in this section are fundamental elements of the agreement between you and IgniteGigs. The Platform would not be provided without these limitations.
					</p>
					<p>
						<strong class="text-secondary">13.5 Statutory Rights.</strong> Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded or limited under applicable law. Your statutory rights as a consumer are not affected.
					</p>
				</div>
			</article>

			<!-- 14. Indemnification -->
			<article id="indemnification" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					14. Indemnification
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">14.1 User Indemnity.</strong> You agree to indemnify, defend, and hold harmless IgniteGigs, its directors, officers, employees, agents, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising from or related to:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Your use of the Platform</li>
						<li>Your breach of these Terms</li>
						<li>Your violation of any applicable law or regulation</li>
						<li>Your Content or any activity conducted through your account</li>
						<li>Any dispute between you and another User</li>
						<li>Services you provide or receive through the Platform</li>
					</ul>
					<p>
						<strong class="text-secondary">14.2 Performer-Specific Indemnity.</strong> Performers additionally agree to indemnify IgniteGigs against any claims arising from:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>The performance of their Services</li>
						<li>Any injury, damage, or loss caused during their performances</li>
						<li>Lack of or inadequate insurance coverage</li>
						<li>Violation of safety regulations or venue requirements</li>
					</ul>
					<p>
						<strong class="text-secondary">14.3 Notice and Cooperation.</strong> We will promptly notify you of any claim subject to indemnification and allow you to control the defence, provided that we may participate with counsel of our choosing. You agree not to settle any claim without our prior written consent.
					</p>
				</div>
			</article>

			<!-- 15. Disclaimer of Warranties -->
			<article id="warranties" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					15. Disclaimer of Warranties
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">15.1 "As Is" Basis.</strong> THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
					</p>
					<p>
						<strong class="text-secondary">15.2 No Guarantees.</strong> IgniteGigs does not warrant or guarantee that:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>The Platform will be uninterrupted, timely, secure, or error-free</li>
						<li>The results obtained from using the Platform will be accurate or reliable</li>
						<li>The quality of any Services obtained through the Platform will meet your expectations</li>
						<li>Any errors in the Platform will be corrected</li>
					</ul>
					<p>
						<strong class="text-secondary">15.3 Third-Party Services.</strong> We do not endorse, warrant, or assume responsibility for any third-party services, content, or products advertised or offered through the Platform.
					</p>
					<p>
						<strong class="text-secondary">15.4 User Verification.</strong> While we implement verification processes, we do not guarantee the identity, qualifications, or trustworthiness of any User. Users are responsible for conducting their own due diligence.
					</p>
					<p>
						<strong class="text-secondary">15.5 Jurisdictional Limitations.</strong> Some jurisdictions do not allow the exclusion of certain warranties. In such jurisdictions, the above exclusions may not apply to you to the extent prohibited by law.
					</p>
				</div>
			</article>

			<!-- 16. Termination -->
			<article id="termination" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					16. Termination
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">16.1 User Termination.</strong> You may terminate your account at any time by contacting our support team or using the account deletion feature in your dashboard. Upon termination:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>You must complete or cancel any pending Bookings</li>
						<li>Any outstanding payments owed to you will be processed</li>
						<li>Your profile will be deactivated and hidden from search results</li>
						<li>Certain information may be retained as required by law or for legitimate business purposes</li>
					</ul>
					<p>
						<strong class="text-secondary">16.2 IgniteGigs Termination.</strong> We may suspend or terminate your account at any time, with or without notice, for any reason, including but not limited to:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Violation of these Terms</li>
						<li>Fraudulent, abusive, or illegal activity</li>
						<li>Conduct harmful to other Users or the Platform</li>
						<li>Extended periods of inactivity</li>
						<li>Requests from law enforcement or government agencies</li>
						<li>Discontinuation of the Platform or material modification of services</li>
					</ul>
					<p>
						<strong class="text-secondary">16.3 Effect of Termination.</strong> Upon termination:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Your right to access and use the Platform immediately ceases</li>
						<li>All licences granted to you under these Terms terminate</li>
						<li>Provisions that by their nature should survive termination will remain in effect</li>
					</ul>
					<p>
						<strong class="text-secondary">16.4 No Refund.</strong> Termination of your account does not entitle you to any refund of fees paid, except as required by applicable law or as set out in our refund policy.
					</p>
				</div>
			</article>

			<!-- 17. Governing Law -->
			<article id="governing-law" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					17. Governing Law
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">17.1 Applicable Law.</strong> These Terms and any dispute or claim arising out of or in connection with them or their subject matter or formation (including non-contractual disputes or claims) shall be governed by and construed in accordance with the laws of England and Wales.
					</p>
					<p>
						<strong class="text-secondary">17.2 Jurisdiction.</strong> The courts of England and Wales shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with these Terms or their subject matter or formation (including non-contractual disputes or claims).
					</p>
					<p>
						<strong class="text-secondary">17.3 Consumer Rights.</strong> If you are a consumer, you may benefit from any mandatory provisions of the law of the country in which you reside. Nothing in these Terms affects your rights as a consumer to rely on such mandatory provisions of local law.
					</p>
					<p>
						<strong class="text-secondary">17.4 European Union Residents.</strong> If you are a consumer based in the European Union, you may also be entitled to submit a complaint through the European Commission's Online Dispute Resolution platform, available at https://ec.europa.eu/odr.
					</p>
				</div>
			</article>

			<!-- 18. Changes to Terms -->
			<article id="changes" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					18. Changes to Terms
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">18.1 Right to Modify.</strong> IgniteGigs reserves the right to modify, update, or replace these Terms at any time at our sole discretion. Material changes will be communicated through:
					</p>
					<ul class="list-disc pl-6 space-y-2">
						<li>Email notification to the address associated with your account</li>
						<li>Prominent notice on the Platform</li>
						<li>In-app notifications</li>
					</ul>
					<p>
						<strong class="text-secondary">18.2 Notice Period.</strong> For material changes, we will provide at least thirty (30) days' notice before the changes take effect, except where changes are required to comply with legal obligations or to address security concerns.
					</p>
					<p>
						<strong class="text-secondary">18.3 Acceptance of Changes.</strong> Your continued use of the Platform after the effective date of any changes constitutes your acceptance of the revised Terms. If you do not agree to the changes, you must stop using the Platform and may terminate your account.
					</p>
					<p>
						<strong class="text-secondary">18.4 Review Responsibility.</strong> It is your responsibility to review these Terms periodically for changes. The "Last Updated" date at the top of this page indicates when the Terms were last revised.
					</p>
				</div>
			</article>

			<!-- 19. Severability -->
			<article id="severability" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					19. Severability
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">19.1 Invalid Provisions.</strong> If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such invalidity, illegality, or unenforceability shall not affect the other provisions of these Terms, which shall remain in full force and effect.
					</p>
					<p>
						<strong class="text-secondary">19.2 Reformation.</strong> The invalid, illegal, or unenforceable provision shall be modified to the minimum extent necessary to make it valid, legal, and enforceable while preserving the original intent of the parties. If such modification is not possible, the provision shall be deemed severed from these Terms.
					</p>
					<p>
						<strong class="text-secondary">19.3 Entire Agreement.</strong> These Terms, together with our Privacy Policy and any other agreements expressly incorporated by reference, constitute the entire agreement between you and IgniteGigs regarding the Platform and supersede all prior agreements and understandings.
					</p>
					<p>
						<strong class="text-secondary">19.4 Waiver.</strong> No waiver of any term or condition of these Terms shall be deemed a further or continuing waiver of such term or condition or any other term or condition. Any failure to assert a right or provision under these Terms shall not constitute a waiver of such right or provision.
					</p>
				</div>
			</article>

			<!-- 20. Contact Information -->
			<article id="contact" class="mb-12 scroll-mt-32">
				<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary mb-4">
					20. Contact Information
				</h2>
				<div class="bg-white rounded-card shadow-card p-6 md:p-8 space-y-4 text-gray-600">
					<p>
						<strong class="text-secondary">20.1</strong> If you have any questions, concerns, or complaints regarding these Terms or the Platform, please contact us:
					</p>
					<div class="bg-gray-50 rounded-xl p-6 mt-4">
						<p class="font-semibold text-secondary mb-4">IgniteGigs Ltd</p>
						<div class="space-y-2">
							<p>
								<strong>Email:</strong>
								<a href="mailto:legal@ignitegigs.com" class="text-primary hover:underline">legal@ignitegigs.com</a>
							</p>
							<p>
								<strong>General Enquiries:</strong>
								<a href="mailto:hello@ignitegigs.com" class="text-primary hover:underline">hello@ignitegigs.com</a>
							</p>
							<p>
								<strong>Support:</strong>
								<a href="mailto:support@ignitegigs.com" class="text-primary hover:underline">support@ignitegigs.com</a>
							</p>
							<p>
								<strong>Website:</strong>
								<a href="https://ignitegigs.com" class="text-primary hover:underline">www.ignitegigs.com</a>
							</p>
						</div>
					</div>
					<p class="mt-4">
						<strong class="text-secondary">20.2</strong> For legal notices, please send correspondence to our registered office address, which will be provided upon request.
					</p>
					<p>
						<strong class="text-secondary">20.3</strong> We aim to respond to all enquiries within five (5) business days.
					</p>
				</div>
			</article>
		</div>
	</div>
</section>

<!-- Related Links -->
<section class="py-12 md:py-16 bg-gray-50">
	<div class="container-wide">
		<div class="text-center mb-8">
			<h2 class="font-display text-2xl md:text-3xl font-bold text-secondary">
				Related Policies
			</h2>
		</div>
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
			<a href="/privacy" class="bg-white rounded-card shadow-card p-6 hover:shadow-card-hover transition-shadow group">
				<div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
					<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
				<h3 class="font-display text-lg font-semibold text-secondary mb-2">Privacy Policy</h3>
				<p class="text-gray-600 text-sm">Learn how we collect, use, and protect your personal data.</p>
			</a>

			<a href="/trust-safety" class="bg-white rounded-card shadow-card p-6 hover:shadow-card-hover transition-shadow group">
				<div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
					<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
				</div>
				<h3 class="font-display text-lg font-semibold text-secondary mb-2">Trust & Safety</h3>
				<p class="text-gray-600 text-sm">Our commitment to verification, insurance, and community trust.</p>
			</a>

			<a href="/faq" class="bg-white rounded-card shadow-card p-6 hover:shadow-card-hover transition-shadow group">
				<div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
					<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h3 class="font-display text-lg font-semibold text-secondary mb-2">FAQ</h3>
				<p class="text-gray-600 text-sm">Answers to common questions about using IgniteGigs.</p>
			</a>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-12 md:py-16">
	<div class="container-wide">
		<div class="bg-secondary rounded-3xl p-8 md:p-12 text-center text-white">
			<h2 class="font-display text-2xl md:text-3xl font-bold mb-4">
				Questions about these Terms?
			</h2>
			<p class="text-gray-300 mb-6 max-w-2xl mx-auto">
				Our team is here to help clarify any aspect of our Terms of Service. Get in touch and we'll respond within 48 hours.
			</p>
			<a href="/contact" class="btn btn-lg bg-primary text-white hover:bg-primary-dark font-semibold px-8">
				Contact Us
			</a>
		</div>
	</div>
</section>
