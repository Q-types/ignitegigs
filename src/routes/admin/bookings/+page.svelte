<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	interface BookingRow {
		id: string;
		status: string;
		event_date: string;
		event_time: string | null;
		event_location: string;
		event_type: string | null;
		quoted_price_pence: number;
		agreed_price_pence: number | null;
		platform_fee_pence: number | null;
		deposit_paid: boolean;
		final_paid: boolean;
		created_at: string;
		clientName: string;
		performerName: string;
	}

	interface BookingsPageData {
		bookings: BookingRow[];
		totalCount: number;
		currentPage: number;
		totalPages: number;
		statusFilter: string;
		statusCounts: {
			all: number;
			pending: number;
			confirmed: number;
			completed: number;
			cancelled: number;
			disputed: number;
		};
	}

	let { data }: { data: BookingsPageData } = $props();

	const bookings = $derived(data.bookings);
	const statusCounts = $derived(data.statusCounts);

	const statusTabs = $derived([
		{ key: 'all', label: 'All', count: statusCounts.all },
		{ key: 'pending', label: 'Pending', count: statusCounts.pending },
		{ key: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed },
		{ key: 'completed', label: 'Completed', count: statusCounts.completed },
		{ key: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
		{ key: 'disputed', label: 'Disputed', count: statusCounts.disputed }
	]);

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

	function switchStatus(status: string) {
		const params = new URLSearchParams();
		if (status !== 'all') params.set('status', status);
		const qs = params.toString();
		goto(`/admin/bookings${qs ? '?' + qs : ''}`);
	}

	function goToPage(pageNum: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', String(pageNum));
		goto(`/admin/bookings?${params.toString()}`);
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold text-gray-900">Bookings</h1>
		<p class="mt-1 text-sm text-gray-500">All platform bookings with performer and client details.</p>
	</div>

	<!-- Status Tabs -->
	<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
		<div class="border-b border-gray-200">
			<nav class="flex overflow-x-auto -mb-px">
				{#each statusTabs as tab}
					<button
						type="button"
						onclick={() => switchStatus(tab.key)}
						class="flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap {data.statusFilter === tab.key
							? 'border-b-2 text-gray-900'
							: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
						style={data.statusFilter === tab.key ? 'border-color: #FF6B35; color: #FF6B35;' : ''}
					>
						{tab.label}
						<span class="ml-1.5 inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full {data.statusFilter === tab.key ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}">
							{tab.count}
						</span>
					</button>
				{/each}
			</nav>
		</div>

		<!-- Table -->
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-gray-100 bg-gray-50 text-left">
						<th class="px-5 py-3 font-medium text-gray-500">Booking ID</th>
						<th class="px-5 py-3 font-medium text-gray-500">Client</th>
						<th class="px-5 py-3 font-medium text-gray-500">Performer</th>
						<th class="px-5 py-3 font-medium text-gray-500">Event Date</th>
						<th class="px-5 py-3 font-medium text-gray-500">Location</th>
						<th class="px-5 py-3 font-medium text-gray-500">Amount</th>
						<th class="px-5 py-3 font-medium text-gray-500">Fee</th>
						<th class="px-5 py-3 font-medium text-gray-500">Payment</th>
						<th class="px-5 py-3 font-medium text-gray-500">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-50">
					{#each bookings as booking}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-5 py-3">
								<span class="font-mono text-xs text-gray-500" title={booking.id}>
									{booking.id.slice(0, 8)}...
								</span>
							</td>
							<td class="px-5 py-3 text-gray-900 font-medium">{booking.clientName}</td>
							<td class="px-5 py-3 text-gray-900">{booking.performerName}</td>
							<td class="px-5 py-3 text-gray-600">
								<div>{formatDate(booking.event_date)}</div>
								{#if booking.event_time}
									<div class="text-xs text-gray-400">{booking.event_time}</div>
								{/if}
							</td>
							<td class="px-5 py-3 text-gray-600 max-w-[200px] truncate" title={booking.event_location}>
								{booking.event_location}
							</td>
							<td class="px-5 py-3 font-medium text-gray-900">
								{formatPence(booking.agreed_price_pence ?? booking.quoted_price_pence)}
							</td>
							<td class="px-5 py-3 text-gray-600">
								{booking.platform_fee_pence ? formatPence(booking.platform_fee_pence) : '--'}
							</td>
							<td class="px-5 py-3">
								<div class="flex flex-col gap-0.5">
									<span class="text-xs {booking.deposit_paid ? 'text-green-600' : 'text-gray-400'}">
										Deposit: {booking.deposit_paid ? 'Paid' : 'Unpaid'}
									</span>
									<span class="text-xs {booking.final_paid ? 'text-green-600' : 'text-gray-400'}">
										Final: {booking.final_paid ? 'Paid' : 'Unpaid'}
									</span>
								</div>
							</td>
							<td class="px-5 py-3">
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize {getStatusColour(booking.status)}">
									{booking.status}
								</span>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="9" class="px-5 py-12 text-center text-gray-400">
								No bookings found{#if data.statusFilter !== 'all'} with status "{data.statusFilter}"{/if}.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if data.totalPages > 1}
			<div class="px-5 py-4 border-t border-gray-200 flex items-center justify-between">
				<p class="text-sm text-gray-500">
					Page {data.currentPage} of {data.totalPages}
					<span class="hidden sm:inline">&middot; {data.totalCount.toLocaleString('en-GB')} total</span>
				</p>
				<div class="flex items-center gap-2">
					<button
						type="button"
						disabled={data.currentPage <= 1}
						onclick={() => goToPage(data.currentPage - 1)}
						class="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
					>
						Previous
					</button>
					<button
						type="button"
						disabled={data.currentPage >= data.totalPages}
						onclick={() => goToPage(data.currentPage + 1)}
						class="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
					>
						Next
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
