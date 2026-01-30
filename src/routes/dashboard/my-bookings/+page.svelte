<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Badge, Avatar } from '$lib/components/ui';

	let { data } = $props();

	type BookingStatus = 'inquiry' | 'pending' | 'accepted' | 'confirmed' | 'completed' | 'cancelled' | 'declined' | 'disputed';

	interface PerformerUser {
		full_name: string;
		avatar_url: string | null;
	}

	interface PerformerInfo {
		id: string;
		stage_name: string | null;
		performer_category: string[];
		avg_rating: number;
		total_reviews: number;
		user: PerformerUser | null;
	}

	interface ClientBooking {
		id: string;
		performer_id: string;
		client_id: string;
		status: BookingStatus;
		event_date: string;
		event_time: string | null;
		event_location: string;
		event_type: string | null;
		event_details: string | null;
		guest_count: number | null;
		quoted_price_pence: number;
		agreed_price_pence: number | null;
		deposit_paid: boolean;
		deposit_paid_at: string | null;
		final_paid: boolean;
		created_at: string;
		performer: PerformerInfo | null;
	}

	const statusTabs = [
		{ key: 'all', label: 'All' },
		{ key: 'active', label: 'Active' },
		{ key: 'inquiry', label: 'Inquiries' },
		{ key: 'confirmed', label: 'Confirmed' },
		{ key: 'completed', label: 'Completed' },
		{ key: 'past', label: 'Past' }
	];

	function getStatusVariant(status: string): 'default' | 'success' | 'warning' | 'error' | 'info' {
		switch (status) {
			case 'inquiry':
				return 'warning';
			case 'pending':
				return 'warning';
			case 'accepted':
				return 'info';
			case 'confirmed':
				return 'success';
			case 'completed':
				return 'default';
			case 'cancelled':
				return 'error';
			case 'declined':
				return 'error';
			case 'disputed':
				return 'error';
			default:
				return 'default';
		}
	}

	function getStatusLabel(status: string): string {
		switch (status) {
			case 'inquiry':
				return 'Inquiry Sent';
			case 'pending':
				return 'Pending';
			case 'accepted':
				return 'Accepted';
			case 'confirmed':
				return 'Confirmed';
			case 'completed':
				return 'Completed';
			case 'cancelled':
				return 'Cancelled';
			case 'declined':
				return 'Declined';
			case 'disputed':
				return 'Disputed';
			default:
				return status;
		}
	}

	function formatPrice(pence: number): string {
		return `\u00A3${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			weekday: 'short',
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function formatTime(timeStr: string | null): string {
		if (!timeStr) return '';
		// Handle HH:mm:ss or HH:mm format
		const parts = timeStr.split(':');
		const hour = parseInt(parts[0]);
		const minute = parts[1];
		const ampm = hour >= 12 ? 'pm' : 'am';
		const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
		return `${displayHour}:${minute}${ampm}`;
	}

	function isCancellable(status: string): boolean {
		return ['inquiry', 'pending', 'accepted', 'confirmed'].includes(status);
	}

	function isReviewable(booking: ClientBooking): boolean {
		return booking.status === 'completed' && !data.reviewedBookingIds.includes(booking.id);
	}

	function isUpcoming(dateStr: string): boolean {
		return new Date(dateStr) >= new Date(new Date().toDateString());
	}

	function getPerformerName(performer: PerformerInfo | null): string {
		if (!performer) return 'Unknown Performer';
		return performer.stage_name || performer.user?.full_name || 'Performer';
	}

	function getPerformerAvatar(performer: PerformerInfo | null): string | null {
		return performer?.user?.avatar_url ?? null;
	}

	function switchTab(key: string) {
		const url = new URL($page.url);
		if (key === 'all') {
			url.searchParams.delete('status');
		} else {
			url.searchParams.set('status', key);
		}
		goto(url.toString(), { replaceState: true, noScroll: true });
	}
</script>

<svelte:head>
	<title>My Bookings - IgniteGigs</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl lg:text-3xl font-bold text-secondary">My Bookings</h1>
			<p class="text-gray-600 mt-1">Track and manage all your performer bookings</p>
		</div>
		<a
			href="/performers"
			class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-[#e55a2b] transition-colors"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
			Find Performers
		</a>
	</div>

	<!-- Status Filter Tabs -->
	<div class="border-b border-gray-200">
		<nav class="-mb-px flex gap-x-6 overflow-x-auto" aria-label="Booking status tabs">
			{#each statusTabs as tab}
				{@const isActive = data.statusFilter === tab.key}
				{@const count = data.statusCounts[tab.key] ?? 0}
				<button
					type="button"
					onclick={() => switchTab(tab.key)}
					class="whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors flex items-center gap-2 {isActive
						? 'border-[#FF6B35] text-[#FF6B35]'
						: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
				>
					{tab.label}
					{#if count > 0}
						<span
							class="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold {isActive
								? 'bg-[#FF6B35]/10 text-[#FF6B35]'
								: 'bg-gray-100 text-gray-600'}"
						>
							{count}
						</span>
					{/if}
				</button>
			{/each}
		</nav>
	</div>

	<!-- Bookings List -->
	{#if data.bookings.length > 0}
		<div class="space-y-4">
			{#each data.bookings as booking (booking.id)}
				{@const performer = booking.performer as PerformerInfo | null}
				{@const upcoming = isUpcoming(booking.event_date)}
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
					<div class="p-5 sm:p-6">
						<div class="flex flex-col sm:flex-row sm:items-start gap-4">
							<!-- Performer Avatar -->
							<div class="flex-shrink-0">
								<Avatar
									src={getPerformerAvatar(performer)}
									name={getPerformerName(performer)}
									size="lg"
								/>
							</div>

							<!-- Booking Info -->
							<div class="flex-1 min-w-0">
								<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
									<h3 class="text-lg font-semibold text-[#1E1E2E] truncate">
										{getPerformerName(performer)}
									</h3>
									<Badge variant={getStatusVariant(booking.status)} size="sm">
										{getStatusLabel(booking.status)}
									</Badge>
									{#if upcoming && ['accepted', 'confirmed'].includes(booking.status)}
										<span class="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
											<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
											Upcoming
										</span>
									{/if}
								</div>

								<!-- Performer category -->
								{#if performer?.performer_category && performer.performer_category.length > 0}
									<p class="text-sm text-gray-500 mb-3">
										{performer.performer_category.join(', ')}
										{#if performer.avg_rating > 0}
											<span class="inline-flex items-center gap-1 ml-2">
												<svg class="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
													<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
												</svg>
												<span class="text-xs font-medium text-gray-700">{performer.avg_rating.toFixed(1)}</span>
												<span class="text-xs text-gray-400">({performer.total_reviews})</span>
											</span>
										{/if}
									</p>
								{/if}

								<!-- Event Details Grid -->
								<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
									<!-- Date -->
									<div class="flex items-center gap-2 text-gray-600">
										<svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
										<span>{formatDate(booking.event_date)}</span>
										{#if booking.event_time}
											<span class="text-gray-400">at {formatTime(booking.event_time)}</span>
										{/if}
									</div>

									<!-- Location -->
									<div class="flex items-center gap-2 text-gray-600">
										<svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
										<span class="truncate">{booking.event_location}</span>
									</div>

									<!-- Event Type -->
									{#if booking.event_type}
										<div class="flex items-center gap-2 text-gray-600">
											<svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
											</svg>
											<span>{booking.event_type}</span>
										</div>
									{/if}

									<!-- Price -->
									<div class="flex items-center gap-2 text-gray-600">
										<svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										<span class="font-semibold text-[#1E1E2E]">
											{formatPrice(booking.agreed_price_pence || booking.quoted_price_pence)}
										</span>
										{#if booking.deposit_paid}
											<span class="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Deposit paid</span>
										{/if}
									</div>
								</div>

								<!-- Guest count -->
								{#if booking.guest_count}
									<div class="flex items-center gap-2 text-sm text-gray-500 mt-2">
										<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
										</svg>
										<span>{booking.guest_count} guests</span>
									</div>
								{/if}
							</div>

							<!-- Actions -->
							<div class="flex flex-row sm:flex-col gap-2 flex-shrink-0">
								<a
									href="/dashboard/my-bookings/{booking.id}"
									class="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-[#1E1E2E] bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
									View
								</a>

								{#if isCancellable(booking.status)}
									<button
										type="button"
										class="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
										Cancel
									</button>
								{/if}

								{#if isReviewable(booking)}
									<a
										href="/dashboard/my-bookings/{booking.id}/review"
										class="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#FF6B35] hover:bg-[#e55a2b] rounded-lg transition-colors"
									>
										<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										Review
									</a>
								{/if}

								{#if booking.status === 'completed' && data.reviewedBookingIds.includes(booking.id)}
									<span class="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-50 rounded-lg cursor-default">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
										Reviewed
									</span>
								{/if}
							</div>
						</div>
					</div>

					<!-- Payment status bar for confirmed/accepted bookings -->
					{#if ['accepted', 'confirmed'].includes(booking.status)}
						<div class="px-5 sm:px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-sm">
							<div class="flex items-center gap-4">
								<span class="flex items-center gap-1.5">
									{#if booking.deposit_paid}
										<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
										</svg>
										<span class="text-green-700">Deposit paid</span>
									{:else}
										<svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
										</svg>
										<span class="text-yellow-700">Deposit pending</span>
									{/if}
								</span>
								{#if booking.final_paid}
									<span class="flex items-center gap-1.5">
										<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
										</svg>
										<span class="text-green-700">Fully paid</span>
									</span>
								{/if}
							</div>
							{#if !booking.deposit_paid}
								<a
									href="/pay/{booking.id}"
									class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#FF6B35] hover:bg-[#e55a2b] rounded-lg transition-colors"
								>
									Pay Deposit
								</a>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<!-- Empty State -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
			<div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
				<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
				</svg>
			</div>
			{#if data.statusFilter === 'all'}
				<h3 class="text-lg font-semibold text-[#1E1E2E] mb-2">No bookings yet</h3>
				<p class="text-gray-500 mb-6 max-w-sm mx-auto">
					You haven't made any bookings yet. Browse our talented performers to find the perfect act for your event.
				</p>
				<a
					href="/performers"
					class="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-white font-medium rounded-lg hover:bg-[#e55a2b] transition-colors"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					Browse Performers
				</a>
			{:else}
				<h3 class="text-lg font-semibold text-[#1E1E2E] mb-2">No {data.statusFilter} bookings</h3>
				<p class="text-gray-500 mb-6">
					You don't have any bookings with this status.
				</p>
				<button
					type="button"
					onclick={() => switchTab('all')}
					class="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-[#1E1E2E] font-medium rounded-lg hover:bg-gray-200 transition-colors"
				>
					View All Bookings
				</button>
			{/if}
		</div>
	{/if}
</div>
