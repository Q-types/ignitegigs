<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { data } = $props();

	const statusFilters = [
		{ value: 'all', label: 'All' },
		{ value: 'open', label: 'Open' },
		{ value: 'under_review', label: 'Under Review' },
		{ value: 'resolved_refund', label: 'Refunded' },
		{ value: 'resolved_warning', label: 'Warning' },
		{ value: 'resolved_no_action', label: 'No Action' },
		{ value: 'closed', label: 'Closed' }
	];

	const reasonLabels: Record<string, string> = {
		no_show: 'No Show',
		poor_quality: 'Poor Quality',
		safety_concern: 'Safety Concern',
		payment_issue: 'Payment Issue',
		harassment: 'Harassment',
		other: 'Other'
	};

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function formatDateTime(dateStr: string): string {
		return new Date(dateStr).toLocaleString('en-GB', {
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getStatusBadgeClasses(status: string): string {
		switch (status) {
			case 'open':
				return 'bg-red-100 text-red-800';
			case 'under_review':
				return 'bg-amber-100 text-amber-800';
			case 'resolved_refund':
				return 'bg-blue-100 text-blue-800';
			case 'resolved_warning':
				return 'bg-orange-100 text-orange-800';
			case 'resolved_no_action':
				return 'bg-gray-100 text-gray-800';
			case 'closed':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function formatStatus(status: string): string {
		return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
	}

	function getReasonBadgeClasses(reason: string): string {
		switch (reason) {
			case 'harassment':
			case 'safety_concern':
				return 'bg-red-50 text-red-700';
			case 'no_show':
				return 'bg-amber-50 text-amber-700';
			case 'payment_issue':
				return 'bg-blue-50 text-blue-700';
			default:
				return 'bg-gray-50 text-gray-700';
		}
	}

	function setFilter(status: string) {
		const params = new URLSearchParams($page.url.searchParams);
		if (status === 'all') {
			params.delete('status');
		} else {
			params.set('status', status);
		}
		goto(`/admin/disputes?${params.toString()}`, { replaceState: true });
	}
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-[#1E1E2E]">Dispute Management</h1>
			<p class="text-gray-600 mt-1">Review and resolve booking disputes</p>
		</div>
		<div class="text-sm text-gray-500">
			{data.statusCounts.all} total disputes
		</div>
	</div>

	<!-- Status Filter Tabs -->
	<div class="flex gap-2 flex-wrap">
		{#each statusFilters as filter}
			{@const count = data.statusCounts[filter.value] ?? 0}
			<button
				class="px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2 {data.statusFilter === filter.value
					? 'bg-[#FF6B35] text-white'
					: 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}"
				onclick={() => setFilter(filter.value)}
			>
				{filter.label}
				{#if count > 0}
					<span
						class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold {data.statusFilter === filter.value
							? 'bg-white/20 text-white'
							: 'bg-gray-100 text-gray-600'}"
					>
						{count}
					</span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Disputes Table -->
	{#if data.disputes.length > 0}
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-gray-200 bg-gray-50">
							<th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
								ID
							</th>
							<th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Booking
							</th>
							<th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Raised By
							</th>
							<th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Against
							</th>
							<th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Reason
							</th>
							<th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Date
							</th>
							<th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
								<span class="sr-only">Actions</span>
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-100">
						{#each data.disputes as dispute}
							<tr class="hover:bg-gray-50 transition-colors">
								<td class="px-6 py-4">
									<span class="font-mono text-sm text-gray-600">
										{dispute.id.slice(0, 8)}
									</span>
								</td>
								<td class="px-6 py-4">
									<div class="text-sm">
										<p class="font-medium text-gray-900">
											{dispute.booking?.event_type || 'Event'}
										</p>
										<p class="text-gray-500">
											{dispute.booking?.event_date ? formatDate(dispute.booking.event_date) : '-'}
										</p>
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center gap-2">
										{#if dispute.raiser?.avatar_url}
											<img
												src={dispute.raiser.avatar_url}
												alt=""
												class="w-7 h-7 rounded-full object-cover"
											/>
										{:else}
											<div class="w-7 h-7 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
												<span class="text-xs font-medium text-[#FF6B35]">
													{dispute.raiser?.full_name?.charAt(0) || '?'}
												</span>
											</div>
										{/if}
										<span class="text-sm text-gray-900">{dispute.raiser?.full_name || 'Unknown'}</span>
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center gap-2">
										{#if dispute.target?.avatar_url}
											<img
												src={dispute.target.avatar_url}
												alt=""
												class="w-7 h-7 rounded-full object-cover"
											/>
										{:else}
											<div class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
												<span class="text-xs font-medium text-gray-600">
													{dispute.target?.full_name?.charAt(0) || '?'}
												</span>
											</div>
										{/if}
										<span class="text-sm text-gray-900">{dispute.target?.full_name || 'Unknown'}</span>
									</div>
								</td>
								<td class="px-6 py-4">
									<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium {getReasonBadgeClasses(dispute.reason)}">
										{reasonLabels[dispute.reason] || dispute.reason}
									</span>
								</td>
								<td class="px-6 py-4">
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusBadgeClasses(dispute.status)}">
										{formatStatus(dispute.status)}
									</span>
								</td>
								<td class="px-6 py-4 text-sm text-gray-500">
									{formatDateTime(dispute.created_at)}
								</td>
								<td class="px-6 py-4">
									<a
										href="/admin/disputes/{dispute.id}"
										class="text-sm font-medium text-[#FF6B35] hover:text-[#FF6B35]/80 transition-colors"
									>
										View
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{:else}
		<!-- Empty State -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
			<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
				</svg>
			</div>
			<h3 class="font-display text-lg font-semibold text-gray-900 mb-2">
				No disputes found
			</h3>
			<p class="text-gray-600">
				{#if data.statusFilter !== 'all'}
					No disputes with this status. Try a different filter.
				{:else}
					No disputes have been filed yet.
				{/if}
			</p>
			{#if data.statusFilter !== 'all'}
				<button
					class="mt-4 text-sm font-medium text-[#FF6B35] hover:text-[#FF6B35]/80"
					onclick={() => setFilter('all')}
				>
					View all disputes
				</button>
			{/if}
		</div>
	{/if}
</div>
