<script lang="ts">
	import { Badge, Avatar } from '$lib/components/ui';

	let { data } = $props();

	const parentData = data as {
		user: { full_name: string } | null;
		performerProfile: { stage_name?: string; profile_complete: boolean } | null;
		hasPerformerProfile: boolean;
	};

	function formatPrice(pence: number): string {
		return `£${(pence / 100).toLocaleString()}`;
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			weekday: 'short',
			day: 'numeric',
			month: 'short'
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
			case 'cancelled':
			case 'declined':
				return 'error';
			default:
				return 'default';
		}
	}
</script>

<div class="space-y-8">
	<!-- Welcome Header -->
	<div>
		<h1 class="font-display text-2xl lg:text-3xl font-bold text-secondary">
			Welcome back, {parentData.performerProfile?.stage_name || parentData.user?.full_name || 'there'}!
		</h1>
		<p class="text-gray-600 mt-1">Here's what's happening with your gigs.</p>
	</div>

	<!-- Profile Completion Banner -->
	{#if parentData.hasPerformerProfile && !parentData.performerProfile?.profile_complete}
		<div class="bg-gradient-to-r from-primary to-primary-hover rounded-card p-6 text-white">
			<div class="flex items-center justify-between gap-4">
				<div>
					<h2 class="font-display text-xl font-bold mb-1">Complete Your Profile</h2>
					<p class="text-white/80">Add videos and details to start receiving booking requests.</p>
				</div>
				<a href="/dashboard/profile" class="btn bg-white text-primary hover:bg-gray-100 flex-shrink-0">
					Complete Profile
				</a>
			</div>
		</div>
	{/if}

	<!-- Stats Grid -->
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
		<div class="bg-white rounded-card shadow-card p-6">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
					<svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<div>
					<p class="text-2xl font-bold text-secondary">{data.stats?.pending ?? 0}</p>
					<p class="text-sm text-gray-500">Pending</p>
				</div>
			</div>
		</div>

		<div class="bg-white rounded-card shadow-card p-6">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
					<svg class="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
				</div>
				<div>
					<p class="text-2xl font-bold text-secondary">{data.stats?.upcoming ?? 0}</p>
					<p class="text-sm text-gray-500">Upcoming</p>
				</div>
			</div>
		</div>

		<div class="bg-white rounded-card shadow-card p-6">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
					<svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<div>
					<p class="text-2xl font-bold text-secondary">{data.stats?.completed ?? 0}</p>
					<p class="text-sm text-gray-500">Completed</p>
				</div>
			</div>
		</div>

		<div class="bg-white rounded-card shadow-card p-6">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
					<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<div>
					<p class="text-2xl font-bold text-secondary">{formatPrice(data.stats?.totalEarnings ?? 0)}</p>
					<p class="text-sm text-gray-500">Earned</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Content Grid -->
	<div class="grid lg:grid-cols-2 gap-8">
		<!-- Upcoming Events -->
		<div class="bg-white rounded-card shadow-card">
			<div class="p-6 border-b border-gray-100">
				<div class="flex items-center justify-between">
					<h2 class="font-display text-lg font-semibold text-secondary">Upcoming Events</h2>
					<a href="/dashboard/bookings" class="text-sm text-primary hover:text-primary-hover">View all</a>
				</div>
			</div>
			<div class="divide-y divide-gray-100">
				{#if data.upcomingEvents.length > 0}
					{#each data.upcomingEvents as event}
						<a href="/dashboard/bookings/{event.id}" class="block p-4 hover:bg-gray-50 transition-colors">
							<div class="flex items-center gap-4">
								<div class="w-14 h-14 bg-primary/10 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
									<span class="text-xs text-primary font-medium">
										{new Date(event.event_date).toLocaleDateString('en-GB', { month: 'short' })}
									</span>
									<span class="text-xl font-bold text-primary">
										{new Date(event.event_date).getDate()}
									</span>
								</div>
								<div class="flex-1 min-w-0">
									<p class="font-medium text-gray-900 truncate">
										{event.event_type || 'Event'} - {event.event_location}
									</p>
									<p class="text-sm text-gray-500">
										{event.client?.full_name || 'Client'}
									</p>
								</div>
								<Badge variant={getStatusColor(event.status)}>
									{event.status}
								</Badge>
							</div>
						</a>
					{/each}
				{:else}
					<div class="p-8 text-center">
						<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
						</div>
						<p class="text-gray-500">No upcoming events</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="bg-white rounded-card shadow-card">
			<div class="p-6 border-b border-gray-100">
				<div class="flex items-center justify-between">
					<h2 class="font-display text-lg font-semibold text-secondary">Recent Bookings</h2>
					<a href="/dashboard/bookings" class="text-sm text-primary hover:text-primary-hover">View all</a>
				</div>
			</div>
			<div class="divide-y divide-gray-100">
				{#if data.recentBookings.length > 0}
					{#each data.recentBookings as booking}
						<a href="/dashboard/bookings/{booking.id}" class="block p-4 hover:bg-gray-50 transition-colors">
							<div class="flex items-center gap-4">
								<Avatar
									src={booking.client?.avatar_url}
									name={booking.client?.full_name || 'Client'}
									size="md"
								/>
								<div class="flex-1 min-w-0">
									<p class="font-medium text-gray-900 truncate">
										{booking.client?.full_name || 'Client'}
									</p>
									<p class="text-sm text-gray-500">
										{formatDate(booking.event_date)} - {booking.event_location}
									</p>
								</div>
								<Badge variant={getStatusColor(booking.status)}>
									{booking.status}
								</Badge>
							</div>
						</a>
					{/each}
				{:else}
					<div class="p-8 text-center">
						<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
							</svg>
						</div>
						<p class="text-gray-500">No bookings yet</p>
						<a href="/performers" class="btn-primary mt-4 inline-block">
							Find Performers
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="bg-white rounded-card shadow-card p-6">
		<h2 class="font-display text-lg font-semibold text-secondary mb-4">Quick Actions</h2>
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
			<a href="/dashboard/profile" class="p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-center">
				<svg class="w-8 h-8 text-primary mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
				<span class="text-sm font-medium text-gray-900">Edit Profile</span>
			</a>
			<a href="/dashboard/media" class="p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-center">
				<svg class="w-8 h-8 text-primary mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
				</svg>
				<span class="text-sm font-medium text-gray-900">Upload Media</span>
			</a>
			<a href="/dashboard/calendar" class="p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-center">
				<svg class="w-8 h-8 text-primary mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
				<span class="text-sm font-medium text-gray-900">Set Availability</span>
			</a>
			<a href="/performers" class="p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors text-center">
				<svg class="w-8 h-8 text-primary mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<span class="text-sm font-medium text-gray-900">Browse Performers</span>
			</a>
		</div>
	</div>
</div>
