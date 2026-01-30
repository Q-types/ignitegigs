<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isLoading = $state(false);

	// Preference state initialised from server data
	let emailBookingRequests = $state(data.preferences.email_booking_requests);
	let emailBookingUpdates = $state(data.preferences.email_booking_updates);
	let emailMessages = $state(data.preferences.email_messages);
	let emailReviews = $state(data.preferences.email_reviews);
	let emailBlogComments = $state(data.preferences.email_blog_comments);
	let emailMarketing = $state(data.preferences.email_marketing);
	let emailPliExpiry = $state(data.preferences.email_pli_expiry);

	const sections = [
		{
			title: 'Bookings',
			description: 'Notifications related to your booking activity.',
			items: [
				{
					name: 'email_booking_requests',
					label: 'Booking Requests',
					description: 'New booking inquiries from clients wanting to hire you.',
					get checked() { return emailBookingRequests; },
					set checked(v: boolean) { emailBookingRequests = v; }
				},
				{
					name: 'email_booking_updates',
					label: 'Booking Updates',
					description: 'Status changes including accepted, declined, and cancelled bookings.',
					get checked() { return emailBookingUpdates; },
					set checked(v: boolean) { emailBookingUpdates = v; }
				}
			]
		},
		{
			title: 'Communication',
			description: 'Notifications for messages, reviews, and comments.',
			items: [
				{
					name: 'email_messages',
					label: 'Messages',
					description: 'New messages from clients or performers about bookings.',
					get checked() { return emailMessages; },
					set checked(v: boolean) { emailMessages = v; }
				},
				{
					name: 'email_reviews',
					label: 'Reviews',
					description: 'New reviews received on your performer profile.',
					get checked() { return emailReviews; },
					set checked(v: boolean) { emailReviews = v; }
				},
				{
					name: 'email_blog_comments',
					label: 'Blog Comments',
					description: 'Replies and comments on your blog posts.',
					get checked() { return emailBlogComments; },
					set checked(v: boolean) { emailBlogComments = v; }
				}
			]
		},
		{
			title: 'Other',
			description: 'Marketing and system notifications.',
			items: [
				{
					name: 'email_marketing',
					label: 'Marketing',
					description: 'Tips, new features, and promotional content from IgniteGigs.',
					get checked() { return emailMarketing; },
					set checked(v: boolean) { emailMarketing = v; }
				},
				{
					name: 'email_pli_expiry',
					label: 'PLI Expiry Warnings',
					description: 'Reminders when your Public Liability Insurance is about to expire.',
					get checked() { return emailPliExpiry; },
					set checked(v: boolean) { emailPliExpiry = v; }
				}
			]
		}
	];
</script>

<svelte:head>
	<title>Notification Preferences - IgniteGigs</title>
</svelte:head>

<div class="space-y-6 max-w-3xl">
	<!-- Header -->
	<div>
		<h1 class="font-display text-2xl lg:text-3xl font-bold text-secondary">Notification Preferences</h1>
		<p class="text-gray-600 mt-1">Choose which email notifications you would like to receive.</p>
	</div>

	<!-- Success / Error Messages -->
	{#if form?.success}
		<div class="p-4 bg-success/10 text-success rounded-lg flex items-center gap-3">
			<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			{form.message}
		</div>
	{/if}
	{#if form?.error}
		<div class="p-4 bg-error/10 text-error rounded-lg flex items-center gap-3">
			<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			{form.error}
		</div>
	{/if}

	<form
		method="POST"
		action="?/updatePreferences"
		use:enhance={() => {
			isLoading = true;
			return async ({ update }) => {
				isLoading = false;
				await update();
			};
		}}
	>
		{#each sections as section, sectionIndex}
			<div class="bg-white rounded-card shadow-card overflow-hidden {sectionIndex > 0 ? 'mt-6' : ''}">
				<!-- Section Header -->
				<div class="px-6 py-4 border-b border-gray-100">
					<h2 class="font-display text-lg font-semibold text-secondary">{section.title}</h2>
					<p class="text-sm text-gray-500 mt-0.5">{section.description}</p>
				</div>

				<!-- Preference Items -->
				<div class="divide-y divide-gray-100">
					{#each section.items as item}
						<label class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
							<div class="flex-1 min-w-0 pr-4">
								<p class="text-sm font-medium text-gray-900">{item.label}</p>
								<p class="text-xs text-gray-500 mt-0.5">{item.description}</p>
							</div>
							<div class="relative flex-shrink-0">
								<input
									type="checkbox"
									name={item.name}
									bind:checked={item.checked}
									class="sr-only peer"
								/>
								<div class="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors peer-focus:ring-2 peer-focus:ring-primary/20"></div>
								<div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
							</div>
						</label>
					{/each}
				</div>
			</div>
		{/each}

		<!-- Save Button -->
		<div class="flex items-center justify-between pt-2 pb-4">
			<p class="text-xs text-gray-400">
				You will always receive essential account and security emails.
			</p>
			<button type="submit" disabled={isLoading} class="btn-primary btn-md">
				{#if isLoading}
					<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
					</svg>
					Saving...
				{:else}
					Save Preferences
				{/if}
			</button>
		</div>
	</form>
</div>
