<script lang="ts">
	import { enhance } from '$app/forms';
	import { Badge, Avatar, Modal } from '$lib/components/ui';
	import type { ActionData } from './$types';

	let { data, form }: { data: typeof import('./$types').PageData; form: ActionData } = $props();

	let showDeclineModal = $state(false);
	let showCancelModal = $state(false);
	let declineReason = $state('');
	let cancelReason = $state('');
	let newMessage = $state('');
	let isLoading = $state(false);

	const booking = data.booking;

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function formatTime(timeStr: string | null): string {
		if (!timeStr) return 'TBD';
		return timeStr.slice(0, 5);
	}

	function formatPrice(pence: number | null): string {
		if (!pence) return '-';
		return `£${(pence / 100).toLocaleString()}`;
	}

	function formatDateTime(dateStr: string): string {
		return new Date(dateStr).toLocaleString('en-GB', {
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getStatusColor(status: string): 'default' | 'success' | 'warning' | 'error' | 'info' {
		switch (status) {
			case 'confirmed':
			case 'completed':
				return 'success';
			case 'pending':
			case 'inquiry':
				return 'warning';
			case 'accepted':
				return 'info';
			case 'cancelled':
			case 'declined':
				return 'error';
			default:
				return 'default';
		}
	}

	const canAcceptDecline = data.isPerformer && ['inquiry', 'pending'].includes(booking.status);
	const canCancel = data.isClient && ['inquiry', 'pending', 'accepted'].includes(booking.status);
	const canPay = data.isClient && booking.status === 'accepted' && !booking.deposit_paid;
</script>

<div class="space-y-6">
	<!-- Back Link & Header -->
	<div>
		<a href="/dashboard/bookings" class="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-4">
			<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to bookings
		</a>

		<div class="flex items-start justify-between gap-4">
			<div>
				<div class="flex items-center gap-3 mb-2">
					<h1 class="font-display text-2xl font-bold text-secondary">
						{booking.event_type || 'Booking'} Request
					</h1>
					<Badge variant={getStatusColor(booking.status)} size="lg">
						{booking.status}
					</Badge>
				</div>
				<p class="text-gray-600">Created {formatDateTime(booking.created_at)}</p>
			</div>
		</div>
	</div>

	<!-- New Booking Banner -->
	{#if data.isNew}
		<div class="bg-success/10 border border-success/30 rounded-lg p-4 flex items-start gap-3">
			<svg class="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<div>
				<p class="font-medium text-success">Booking request sent!</p>
				<p class="text-sm text-gray-600">The performer will review your request and respond soon.</p>
			</div>
		</div>
	{/if}

	<!-- Success/Error Messages -->
	{#if form?.success}
		<div class="bg-success/10 border border-success/30 rounded-lg p-4 text-success">
			{form.message}
		</div>
	{/if}
	{#if form?.error}
		<div class="bg-error/10 border border-error/30 rounded-lg p-4 text-error">
			{form.error}
		</div>
	{/if}

	<div class="grid lg:grid-cols-3 gap-6">
		<!-- Main Content -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Event Details Card -->
			<div class="bg-white rounded-card shadow-card p-6">
				<h2 class="font-display text-lg font-semibold text-secondary mb-4">Event Details</h2>

				<div class="grid sm:grid-cols-2 gap-6">
					<div>
						<p class="text-sm text-gray-500 mb-1">Date</p>
						<p class="font-medium text-gray-900">{formatDate(booking.event_date)}</p>
					</div>
					<div>
						<p class="text-sm text-gray-500 mb-1">Time</p>
						<p class="font-medium text-gray-900">{formatTime(booking.event_time)}</p>
					</div>
					<div>
						<p class="text-sm text-gray-500 mb-1">Duration</p>
						<p class="font-medium text-gray-900">
							{booking.event_duration_hours ? `${booking.event_duration_hours} hours` : 'TBD'}
						</p>
					</div>
					<div>
						<p class="text-sm text-gray-500 mb-1">Event Type</p>
						<p class="font-medium text-gray-900">{booking.event_type || 'Not specified'}</p>
					</div>
					<div class="sm:col-span-2">
						<p class="text-sm text-gray-500 mb-1">Location</p>
						<p class="font-medium text-gray-900">{booking.event_location}</p>
					</div>
					{#if booking.guest_count}
						<div>
							<p class="text-sm text-gray-500 mb-1">Guest Count</p>
							<p class="font-medium text-gray-900">{booking.guest_count} guests</p>
						</div>
					{/if}
				</div>

				{#if booking.event_details}
					<div class="mt-6 pt-6 border-t border-gray-100">
						<p class="text-sm text-gray-500 mb-2">Additional Details</p>
						<p class="text-gray-700 whitespace-pre-line">{booking.event_details}</p>
					</div>
				{/if}
			</div>

			<!-- Messages -->
			<div class="bg-white rounded-card shadow-card">
				<div class="p-6 border-b border-gray-100">
					<h2 class="font-display text-lg font-semibold text-secondary">Messages</h2>
				</div>

				<div class="max-h-96 overflow-y-auto p-6 space-y-4">
					{#if data.messages.length > 0}
						{#each data.messages as message}
							{@const isOwnMessage = message.sender_id === data.booking.client_id ? data.isClient : data.isPerformer}
							<div class="flex gap-3 {isOwnMessage ? 'flex-row-reverse' : ''}">
								<Avatar
									src={message.sender?.avatar_url}
									name={message.sender?.full_name || 'User'}
									size="sm"
								/>
								<div class="max-w-[70%] {isOwnMessage ? 'text-right' : ''}">
									<div class="inline-block px-4 py-2 rounded-2xl {isOwnMessage ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'}">
										<p class="text-sm">{message.content}</p>
									</div>
									<p class="text-xs text-gray-400 mt-1">{formatDateTime(message.created_at)}</p>
								</div>
							</div>
						{/each}
					{:else}
						<p class="text-center text-gray-500 py-8">No messages yet. Start the conversation!</p>
					{/if}
				</div>

				<!-- Message Input -->
				<form
					method="POST"
					action="?/message"
					use:enhance={() => {
						return async ({ update }) => {
							newMessage = '';
							await update();
						};
					}}
					class="p-4 border-t border-gray-100"
				>
					<div class="flex gap-3">
						<input
							type="text"
							name="content"
							bind:value={newMessage}
							placeholder="Type your message..."
							class="input flex-1"
						/>
						<button type="submit" disabled={!newMessage.trim()} class="btn-primary">
							Send
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Other Party Card -->
			<div class="bg-white rounded-card shadow-card p-6">
				<h3 class="text-sm text-gray-500 mb-3">
					{data.isPerformer ? 'Client' : 'Performer'}
				</h3>
				<div class="flex items-center gap-4">
					<Avatar
						src={data.isPerformer ? booking.client?.avatar_url : booking.performer?.user?.avatar_url}
						name={data.isPerformer
							? booking.client?.full_name || 'Client'
							: booking.performer?.stage_name || booking.performer?.user?.full_name || 'Performer'}
						size="lg"
					/>
					<div>
						<p class="font-semibold text-gray-900">
							{data.isPerformer
								? booking.client?.full_name
								: booking.performer?.stage_name || booking.performer?.user?.full_name}
						</p>
						{#if !data.isPerformer && booking.performer?.location_name}
							<p class="text-sm text-gray-500">{booking.performer.location_name}</p>
						{/if}
					</div>
				</div>
				{#if !data.isPerformer}
					<a href="/performers/{booking.performer?.id}" class="btn-outline btn-sm w-full mt-4">
						View Profile
					</a>
				{/if}
			</div>

			<!-- Pricing Card -->
			<div class="bg-white rounded-card shadow-card p-6">
				<h3 class="font-display font-semibold text-secondary mb-4">Pricing</h3>
				<div class="space-y-3">
					<div class="flex justify-between">
						<span class="text-gray-600">Quoted Price</span>
						<span class="font-medium">{formatPrice(booking.quoted_price_pence)}</span>
					</div>
					{#if booking.agreed_price_pence}
						<div class="flex justify-between">
							<span class="text-gray-600">Agreed Price</span>
							<span class="font-medium text-success">{formatPrice(booking.agreed_price_pence)}</span>
						</div>
					{/if}
					{#if booking.deposit_pence}
						<div class="flex justify-between text-sm">
							<span class="text-gray-500">Deposit (50%)</span>
							<span class="flex items-center gap-2">
								{formatPrice(booking.deposit_pence)}
								{#if booking.deposit_paid}
									<Badge variant="success" size="sm">Paid</Badge>
								{/if}
							</span>
						</div>
					{/if}
				</div>
			</div>

			<!-- Actions Card -->
			{#if canAcceptDecline || canCancel || canPay}
				<div class="bg-white rounded-card shadow-card p-6 space-y-3">
					<h3 class="font-display font-semibold text-secondary mb-4">Actions</h3>

					{#if canAcceptDecline}
						<form method="POST" action="?/accept" use:enhance>
							<button type="submit" class="btn-primary w-full">
								Accept Booking
							</button>
						</form>
						<button
							class="btn-outline w-full text-error border-error hover:bg-error/5"
							onclick={() => (showDeclineModal = true)}
						>
							Decline
						</button>
					{/if}

					{#if canPay}
						<a href="/pay/{booking.id}" class="btn-primary w-full text-center block">
							Pay Deposit
						</a>
					{/if}

					{#if canCancel}
						<button
							class="btn-outline w-full text-error border-error hover:bg-error/5"
							onclick={() => (showCancelModal = true)}
						>
							Cancel Booking
						</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Decline Modal -->
<Modal bind:open={showDeclineModal} title="Decline Booking">
	<form method="POST" action="?/decline" use:enhance class="space-y-4">
		<p class="text-gray-600">Are you sure you want to decline this booking request?</p>
		<div>
			<label for="declineReason" class="label">Reason (optional)</label>
			<textarea
				id="declineReason"
				name="reason"
				rows="3"
				bind:value={declineReason}
				class="input"
				placeholder="Let the client know why you're declining..."
			></textarea>
		</div>
		<div class="flex gap-3">
			<button type="button" class="btn-outline flex-1" onclick={() => (showDeclineModal = false)}>
				Cancel
			</button>
			<button type="submit" class="btn bg-error text-white hover:bg-error/90 flex-1">
				Decline Booking
			</button>
		</div>
	</form>
</Modal>

<!-- Cancel Modal -->
<Modal bind:open={showCancelModal} title="Cancel Booking">
	<form method="POST" action="?/cancel" use:enhance class="space-y-4">
		<p class="text-gray-600">Are you sure you want to cancel this booking?</p>
		<div>
			<label for="cancelReason" class="label">Reason (optional)</label>
			<textarea
				id="cancelReason"
				name="reason"
				rows="3"
				bind:value={cancelReason}
				class="input"
				placeholder="Let the performer know why you're cancelling..."
			></textarea>
		</div>
		<div class="flex gap-3">
			<button type="button" class="btn-outline flex-1" onclick={() => (showCancelModal = false)}>
				Keep Booking
			</button>
			<button type="submit" class="btn bg-error text-white hover:bg-error/90 flex-1">
				Cancel Booking
			</button>
		</div>
	</form>
</Modal>
