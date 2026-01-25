<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Badge, Avatar } from '$lib/components/ui';

	let { data } = $props();

	const filters = [
		{ value: 'all', label: 'All Bookings' },
		{ value: 'pending', label: 'Pending' },
		{ value: 'upcoming', label: 'Upcoming' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'cancelled', label: 'Cancelled' }
	];

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			weekday: 'short',
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function formatPrice(pence: number | null): string {
		if (!pence) return '-';
		return `£${(pence / 100).toLocaleString()}`;
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

	function setFilter(filter: string) {
		const params = new URLSearchParams($page.url.searchParams);
		if (filter === 'all') {
			params.delete('filter');
		} else {
			params.set('filter', filter);
		}
		goto(`/dashboard/bookings?${params.toString()}`, { replaceState: true });
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-secondary">Bookings</h1>
			<p class="text-gray-600">Manage your booking requests and confirmations</p>
		</div>
	</div>

	<!-- Filter Tabs -->
	<div class="flex gap-2 flex-wrap">
		{#each filters as filter}
			<button
				class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {data.filter === filter.value
					? 'bg-primary text-white'
					: 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}"
				onclick={() => setFilter(filter.value)}
			>
				{filter.label}
			</button>
		{/each}
	</div>

	<!-- Bookings List -->
	{#if data.bookings.length > 0}
		<div class="bg-white rounded-card shadow-card overflow-hidden">
			<div class="divide-y divide-gray-100">
				{#each data.bookings as booking}
					<a
						href="/dashboard/bookings/{booking.id}"
						class="block p-4 sm:p-6 hover:bg-gray-50 transition-colors"
					>
						<div class="flex flex-col sm:flex-row sm:items-center gap-4">
							<!-- Client/Performer Info -->
							<div class="flex items-center gap-4 flex-1 min-w-0">
								<Avatar
									src={data.isPerformer ? booking.client?.avatar_url : booking.performer?.user?.avatar_url}
									name={data.isPerformer
										? booking.client?.full_name || 'Client'
										: booking.performer?.stage_name || booking.performer?.user?.full_name || 'Performer'}
									size="lg"
								/>
								<div class="min-w-0">
									<p class="font-medium text-gray-900 truncate">
										{#if data.isPerformer}
											{booking.client?.full_name || 'Client'}
										{:else}
											{booking.performer?.stage_name || booking.performer?.user?.full_name || 'Performer'}
										{/if}
									</p>
									<p class="text-sm text-gray-500 truncate">
										{booking.event_type || 'Event'} - {booking.event_location}
									</p>
								</div>
							</div>

							<!-- Event Date -->
							<div class="flex items-center gap-6 text-sm">
								<div class="text-center">
									<p class="text-gray-500">Event Date</p>
									<p class="font-medium text-gray-900">{formatDate(booking.event_date)}</p>
								</div>

								<!-- Price -->
								<div class="text-center">
									<p class="text-gray-500">Price</p>
									<p class="font-medium text-gray-900">
										{formatPrice(booking.agreed_price_pence || booking.quoted_price_pence)}
									</p>
								</div>

								<!-- Status -->
								<Badge variant={getStatusColor(booking.status)}>
									{booking.status}
								</Badge>

								<!-- Arrow -->
								<svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
								</svg>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{:else}
		<!-- Empty State -->
		<div class="bg-white rounded-card shadow-card p-12 text-center">
			<div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
				<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
				</svg>
			</div>
			<h3 class="font-display text-xl font-semibold text-gray-900 mb-2">
				No bookings found
			</h3>
			<p class="text-gray-600 mb-6">
				{#if data.filter === 'all'}
					You don't have any bookings yet. Start by browsing performers!
				{:else}
					No bookings match this filter.
				{/if}
			</p>
			<div class="flex gap-3 justify-center">
				{#if data.filter !== 'all'}
					<button class="btn-outline" onclick={() => setFilter('all')}>
						View All Bookings
					</button>
				{/if}
				<a href="/performers" class="btn-primary">
					Find Performers
				</a>
			</div>
		</div>
	{/if}
</div>
