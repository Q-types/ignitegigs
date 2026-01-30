<script lang="ts">
	interface BookingRow {
		id: string;
		status: string;
		event_date: string;
		event_location: string;
		quoted_price_pence: number;
		agreed_price_pence: number | null;
		platform_fee_pence: number | null;
		created_at: string;
		clientName: string;
		performerName: string;
	}

	interface AdminPageData {
		stats: {
			totalUsers: number;
			totalPerformers: number;
			totalBookings: number;
			pendingBookings: number;
			confirmedBookings: number;
			completedBookings: number;
			cancelledBookings: number;
			disputedBookings: number;
			pendingVerifications: number;
			totalRevenuePence: number;
		};
		recentBookings: BookingRow[];
	}

	let { data }: { data: AdminPageData } = $props();

	const stats = $derived(data.stats);
	const recentBookings = $derived(data.recentBookings);

	function formatPence(pence: number): string {
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'GBP'
		}).format(pence / 100);
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function getStatusColour(status: string): string {
		const colours: Record<string, string> = {
			inquiry: 'bg-blue-100 text-blue-700',
			pending: 'bg-yellow-100 text-yellow-700',
			accepted: 'bg-indigo-100 text-indigo-700',
			confirmed: 'bg-green-100 text-green-700',
			completed: 'bg-emerald-100 text-emerald-700',
			cancelled: 'bg-gray-100 text-gray-600',
			declined: 'bg-red-100 text-red-700',
			disputed: 'bg-orange-100 text-orange-700'
		};
		return colours[status] ?? 'bg-gray-100 text-gray-600';
	}

	const statCards = $derived([
		{
			label: 'Total Users',
			value: stats.totalUsers.toLocaleString('en-GB'),
			icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
			colour: 'bg-blue-50 text-blue-600',
			iconBg: 'bg-blue-100'
		},
		{
			label: 'Total Performers',
			value: stats.totalPerformers.toLocaleString('en-GB'),
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			colour: 'bg-purple-50 text-purple-600',
			iconBg: 'bg-purple-100'
		},
		{
			label: 'Total Bookings',
			value: stats.totalBookings.toLocaleString('en-GB'),
			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
			colour: 'bg-green-50 text-green-600',
			iconBg: 'bg-green-100'
		},
		{
			label: 'Platform Revenue',
			value: formatPence(stats.totalRevenuePence),
			icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
			colour: 'bg-amber-50 text-amber-600',
			iconBg: 'bg-amber-100'
		}
	]);
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
		<p class="mt-1 text-sm text-gray-500">Platform overview and key metrics.</p>
	</div>

	<!-- Stat Cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		{#each statCards as card}
			<div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
				<div class="flex items-center gap-4">
					<div class="flex-shrink-0 w-11 h-11 rounded-lg {card.iconBg} flex items-center justify-center">
						<svg class="w-5 h-5 {card.colour.split(' ')[1]}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={card.icon} />
						</svg>
					</div>
					<div>
						<p class="text-sm text-gray-500">{card.label}</p>
						<p class="text-xl font-bold text-gray-900">{card.value}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Secondary Stats Row -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
			<div class="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center">
				<svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<div>
				<p class="text-xs text-gray-500">Pending Bookings</p>
				<p class="text-lg font-semibold text-gray-900">{stats.pendingBookings}</p>
			</div>
		</div>
		<div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
			<div class="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
				<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
			</div>
			<div>
				<p class="text-xs text-gray-500">Confirmed</p>
				<p class="text-lg font-semibold text-gray-900">{stats.confirmedBookings}</p>
			</div>
		</div>
		<div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
			<a href="/admin/performers" class="contents">
				<div class="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
					<svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
				</div>
				<div>
					<p class="text-xs text-gray-500">Pending Verifications</p>
					<p class="text-lg font-semibold text-gray-900">{stats.pendingVerifications}</p>
				</div>
			</a>
		</div>
		<div class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
			<a href="/admin/disputes" class="contents">
				<div class="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
					<svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
					</svg>
				</div>
				<div>
					<p class="text-xs text-gray-500">Open Disputes</p>
					<p class="text-lg font-semibold text-red-600">{stats.disputedBookings}</p>
				</div>
			</a>
		</div>
	</div>

	<!-- Recent Bookings -->
	<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
		<div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
			<h2 class="text-lg font-semibold text-gray-900">Recent Bookings</h2>
			<a href="/admin/bookings" class="text-sm font-medium hover:underline" style="color: #FF6B35;">
				View all
			</a>
		</div>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-gray-100 text-left">
						<th class="px-5 py-3 font-medium text-gray-500">Booking</th>
						<th class="px-5 py-3 font-medium text-gray-500">Client</th>
						<th class="px-5 py-3 font-medium text-gray-500">Performer</th>
						<th class="px-5 py-3 font-medium text-gray-500">Event Date</th>
						<th class="px-5 py-3 font-medium text-gray-500">Amount</th>
						<th class="px-5 py-3 font-medium text-gray-500">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-50">
					{#each recentBookings as booking}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-5 py-3">
								<span class="font-mono text-xs text-gray-500">
									{booking.id.slice(0, 8)}...
								</span>
							</td>
							<td class="px-5 py-3 text-gray-900">{booking.clientName}</td>
							<td class="px-5 py-3 text-gray-900">{booking.performerName}</td>
							<td class="px-5 py-3 text-gray-600">{formatDate(booking.event_date)}</td>
							<td class="px-5 py-3 font-medium text-gray-900">
								{formatPence(booking.agreed_price_pence ?? booking.quoted_price_pence)}
							</td>
							<td class="px-5 py-3">
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize {getStatusColour(booking.status)}">
									{booking.status}
								</span>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="px-5 py-8 text-center text-gray-400">
								No bookings yet.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Booking Status Breakdown -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
			<h3 class="text-base font-semibold text-gray-900 mb-4">Booking Status Breakdown</h3>
			<div class="space-y-3">
				{#each [
					{ label: 'Pending', count: stats.pendingBookings, colour: 'bg-yellow-400' },
					{ label: 'Confirmed', count: stats.confirmedBookings, colour: 'bg-green-400' },
					{ label: 'Completed', count: stats.completedBookings, colour: 'bg-emerald-500' },
					{ label: 'Cancelled', count: stats.cancelledBookings, colour: 'bg-gray-400' },
					{ label: 'Disputed', count: stats.disputedBookings, colour: 'bg-red-400' }
				] as row}
					<div class="flex items-center gap-3">
						<span class="text-sm text-gray-600 w-24">{row.label}</span>
						<div class="flex-1 bg-gray-100 rounded-full h-2.5">
							<div
								class="h-2.5 rounded-full {row.colour} transition-all"
								style="width: {stats.totalBookings > 0 ? (row.count / stats.totalBookings) * 100 : 0}%"
							></div>
						</div>
						<span class="text-sm font-medium text-gray-900 w-10 text-right">{row.count}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
			<h3 class="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
			<div class="grid grid-cols-2 gap-3">
				<a
					href="/admin/performers"
					class="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
				>
					<svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
					<span class="text-xs font-medium text-gray-700">Review Verifications</span>
				</a>
				<a
					href="/admin/disputes"
					class="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors"
				>
					<svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
					</svg>
					<span class="text-xs font-medium text-gray-700">Handle Disputes</span>
				</a>
				<a
					href="/admin/users"
					class="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
				>
					<svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
					</svg>
					<span class="text-xs font-medium text-gray-700">Manage Users</span>
				</a>
				<a
					href="/admin/blog"
					class="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
				>
					<svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
					</svg>
					<span class="text-xs font-medium text-gray-700">Moderate Blog</span>
				</a>
			</div>
		</div>
	</div>
</div>
