<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { data, form }: { data: typeof import('./$types').PageData; form: ActionData } = $props();

	let adminNotes = $state(data.dispute.admin_notes ?? '');
	let refundAmount = $state('');
	let resolutionText = $state(data.dispute.resolution ?? '');
	let isSubmitting = $state(false);
	let activeResolutionAction = $state<string | null>(null);

	const dispute = $derived(data.dispute);
	const booking = $derived(dispute.booking);

	const reasonLabels: Record<string, string> = {
		no_show: 'No Show',
		poor_quality: 'Poor Quality',
		safety_concern: 'Safety Concern',
		payment_issue: 'Payment Issue',
		harassment: 'Harassment',
		other: 'Other'
	};

	const statusSteps = [
		{ key: 'open', label: 'Open', icon: 'M12 8v4m0 4h.01' },
		{ key: 'under_review', label: 'Under Review', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
		{ key: 'resolved', label: 'Resolved', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
		{ key: 'closed', label: 'Closed', icon: 'M5 13l4 4L19 7' }
	];

	const isResolved = $derived(
		dispute.status.startsWith('resolved_') || dispute.status === 'closed'
	);

	const currentStepIndex = $derived(() => {
		if (dispute.status === 'open') return 0;
		if (dispute.status === 'under_review') return 1;
		if (dispute.status.startsWith('resolved_')) return 2;
		if (dispute.status === 'closed') return 3;
		return 0;
	});

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			weekday: 'short',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function formatDateTime(dateStr: string): string {
		return new Date(dateStr).toLocaleString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatPrice(pence: number | null): string {
		if (!pence) return '-';
		return `\u00A3${(pence / 100).toFixed(2)}`;
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
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
	<!-- Back Link & Header -->
	<div>
		<a
			href="/admin/disputes"
			class="inline-flex items-center text-sm text-gray-500 hover:text-[#FF6B35] mb-4"
		>
			<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to disputes
		</a>

		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<div class="flex items-center gap-3">
					<h1 class="font-display text-2xl font-bold text-[#1E1E2E]">
						Dispute #{dispute.id.slice(0, 8)}
					</h1>
					<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {getStatusBadgeClasses(dispute.status)}">
						{formatStatus(dispute.status)}
					</span>
				</div>
				<p class="text-gray-600 mt-1">Filed {formatDateTime(dispute.created_at)}</p>
			</div>
		</div>
	</div>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<div class="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
			<div class="flex items-center gap-2">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				{form.message}
			</div>
		</div>
	{/if}
	{#if form?.error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
			{form.error}
		</div>
	{/if}

	<!-- Status Timeline -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
		<h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">Progress</h2>
		<div class="flex items-center justify-between">
			{#each statusSteps as step, i}
				{@const stepIndex = currentStepIndex()}
				{@const isActive = i <= stepIndex}
				{@const isCurrent = i === stepIndex}
				<div class="flex flex-col items-center flex-1">
					<div
						class="w-10 h-10 rounded-full flex items-center justify-center transition-colors
						{isCurrent ? 'bg-[#FF6B35] text-white ring-4 ring-[#FF6B35]/20' : isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={step.icon} />
						</svg>
					</div>
					<p class="mt-2 text-xs font-medium {isCurrent ? 'text-[#FF6B35]' : isActive ? 'text-green-600' : 'text-gray-400'}">
						{step.label}
					</p>
				</div>
				{#if i < statusSteps.length - 1}
					<div class="flex-1 h-0.5 mx-2 {i < stepIndex ? 'bg-green-500' : 'bg-gray-200'}"></div>
				{/if}
			{/each}
		</div>
	</div>

	<div class="grid lg:grid-cols-3 gap-6">
		<!-- Main Content Column -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Dispute Info Card -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 class="font-display text-lg font-semibold text-[#1E1E2E] mb-4">Dispute Details</h2>

				<div class="space-y-4">
					<div>
						<p class="text-sm text-gray-500 mb-1">Reason</p>
						<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700">
							{reasonLabels[dispute.reason] || dispute.reason}
						</span>
					</div>

					<div>
						<p class="text-sm text-gray-500 mb-1">Description</p>
						<div class="bg-gray-50 rounded-lg p-4">
							<p class="text-gray-900 whitespace-pre-line">{dispute.description}</p>
						</div>
					</div>

					{#if dispute.evidence_urls && dispute.evidence_urls.length > 0}
						<div>
							<p class="text-sm text-gray-500 mb-2">Evidence ({dispute.evidence_urls.length} files)</p>
							<div class="space-y-2">
								{#each dispute.evidence_urls as url, i}
									<a
										href={url}
										target="_blank"
										rel="noopener noreferrer"
										class="flex items-center gap-2 text-sm text-[#FF6B35] hover:text-[#FF6B35]/80 bg-orange-50 rounded-lg px-3 py-2"
									>
										<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
										</svg>
										<span class="truncate">Evidence {i + 1}: {url}</span>
										<svg class="w-3 h-3 flex-shrink-0 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
										</svg>
									</a>
								{/each}
							</div>
						</div>
					{/if}

					{#if dispute.resolution}
						<div>
							<p class="text-sm text-gray-500 mb-1">Resolution</p>
							<div class="bg-green-50 rounded-lg p-4 border border-green-200">
								<p class="text-green-900">{dispute.resolution}</p>
								{#if dispute.refund_amount_pence}
									<p class="mt-2 font-semibold text-green-800">
										Refund: {formatPrice(dispute.refund_amount_pence)}
									</p>
								{/if}
								{#if dispute.resolved_at}
									<p class="text-xs text-green-600 mt-2">Resolved {formatDateTime(dispute.resolved_at)}</p>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Booking Details Card -->
			{#if booking}
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 class="font-display text-lg font-semibold text-[#1E1E2E] mb-4">Booking Details</h2>

					<div class="grid sm:grid-cols-2 gap-4">
						<div>
							<p class="text-sm text-gray-500">Booking ID</p>
							<p class="font-mono text-sm text-gray-900">{booking.id.slice(0, 8)}...</p>
						</div>
						<div>
							<p class="text-sm text-gray-500">Booking Status</p>
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusBadgeClasses(booking.status)}">
								{formatStatus(booking.status)}
							</span>
						</div>
						<div>
							<p class="text-sm text-gray-500">Event Date</p>
							<p class="font-medium text-gray-900">{formatDate(booking.event_date)}</p>
						</div>
						<div>
							<p class="text-sm text-gray-500">Event Type</p>
							<p class="font-medium text-gray-900">{booking.event_type || 'Not specified'}</p>
						</div>
						<div class="sm:col-span-2">
							<p class="text-sm text-gray-500">Location</p>
							<p class="font-medium text-gray-900">{booking.event_location}</p>
						</div>
						<div>
							<p class="text-sm text-gray-500">Quoted Price</p>
							<p class="font-medium text-gray-900">{formatPrice(booking.quoted_price_pence)}</p>
						</div>
						<div>
							<p class="text-sm text-gray-500">Agreed Price</p>
							<p class="font-medium text-gray-900">{formatPrice(booking.agreed_price_pence)}</p>
						</div>
						<div>
							<p class="text-sm text-gray-500">Deposit</p>
							<p class="font-medium text-gray-900">
								{formatPrice(booking.deposit_pence)}
								{#if booking.deposit_paid}
									<span class="text-xs text-green-600 ml-1">(Paid)</span>
								{/if}
							</p>
						</div>
						<div>
							<p class="text-sm text-gray-500">Platform Fee</p>
							<p class="font-medium text-gray-900">{formatPrice(booking.platform_fee_pence)}</p>
						</div>
						{#if booking.event_details}
							<div class="sm:col-span-2">
								<p class="text-sm text-gray-500">Event Details</p>
								<p class="text-gray-700 mt-1 whitespace-pre-line">{booking.event_details}</p>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Messages History -->
			{#if data.messages.length > 0}
				<div class="bg-white rounded-xl shadow-sm border border-gray-200">
					<div class="px-6 py-4 border-b border-gray-200">
						<h2 class="font-display text-lg font-semibold text-[#1E1E2E]">
							Message History ({data.messages.length})
						</h2>
					</div>
					<div class="max-h-96 overflow-y-auto p-6 space-y-3">
						{#each data.messages as message}
							<div class="flex gap-3">
								{#if message.sender?.avatar_url}
									<img
										src={message.sender.avatar_url}
										alt=""
										class="w-8 h-8 rounded-full object-cover flex-shrink-0"
									/>
								{:else}
									<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
										<span class="text-xs font-medium text-gray-500">
											{message.sender?.full_name?.charAt(0) || '?'}
										</span>
									</div>
								{/if}
								<div class="flex-1 min-w-0">
									<div class="flex items-baseline gap-2">
										<p class="text-sm font-medium text-gray-900">
											{message.sender?.full_name || 'Unknown'}
										</p>
										<p class="text-xs text-gray-400">
											{formatDateTime(message.created_at)}
										</p>
									</div>
									<p class="text-sm text-gray-700 mt-0.5">{message.content}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Parties Info -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h3 class="font-display font-semibold text-[#1E1E2E] mb-4">Parties Involved</h3>

				<!-- Raiser -->
				<div class="mb-4 pb-4 border-b border-gray-100">
					<p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Raised By</p>
					<div class="flex items-center gap-3">
						{#if dispute.raiser?.avatar_url}
							<img
								src={dispute.raiser.avatar_url}
								alt=""
								class="w-10 h-10 rounded-full object-cover"
							/>
						{:else}
							<div class="w-10 h-10 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
								<span class="text-sm font-semibold text-[#FF6B35]">
									{dispute.raiser?.full_name?.charAt(0) || '?'}
								</span>
							</div>
						{/if}
						<div>
							<p class="font-medium text-gray-900">{dispute.raiser?.full_name || 'Unknown'}</p>
							<p class="text-xs text-gray-500">{dispute.raiser?.email || ''}</p>
						</div>
					</div>
					{#if dispute.raiser?.phone}
						<p class="text-xs text-gray-500 mt-2">Phone: {dispute.raiser.phone}</p>
					{/if}
					<p class="text-xs text-gray-400 mt-1">
						Type: {dispute.raiser?.user_type || 'unknown'} | Joined {dispute.raiser?.created_at ? formatDate(dispute.raiser.created_at) : '-'}
					</p>
				</div>

				<!-- Target -->
				<div>
					<p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Raised Against</p>
					<div class="flex items-center gap-3">
						{#if dispute.target?.avatar_url}
							<img
								src={dispute.target.avatar_url}
								alt=""
								class="w-10 h-10 rounded-full object-cover"
							/>
						{:else}
							<div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
								<span class="text-sm font-semibold text-gray-600">
									{dispute.target?.full_name?.charAt(0) || '?'}
								</span>
							</div>
						{/if}
						<div>
							<p class="font-medium text-gray-900">{dispute.target?.full_name || 'Unknown'}</p>
							<p class="text-xs text-gray-500">{dispute.target?.email || ''}</p>
						</div>
					</div>
					{#if dispute.target?.phone}
						<p class="text-xs text-gray-500 mt-2">Phone: {dispute.target.phone}</p>
					{/if}
					<p class="text-xs text-gray-400 mt-1">
						Type: {dispute.target?.user_type || 'unknown'} | Joined {dispute.target?.created_at ? formatDate(dispute.target.created_at) : '-'}
					</p>
				</div>

				<!-- Performer Profile -->
				{#if data.performerProfile}
					<div class="mt-4 pt-4 border-t border-gray-100">
						<p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Performer Profile</p>
						<div class="text-sm space-y-1">
							<p class="text-gray-900 font-medium">{data.performerProfile.stage_name || 'No stage name'}</p>
							<p class="text-gray-500">{data.performerProfile.location_name}</p>
							<div class="flex items-center gap-3 text-xs text-gray-500">
								<span>Rating: {data.performerProfile.avg_rating}/5</span>
								<span>Bookings: {data.performerProfile.total_bookings}</span>
								{#if data.performerProfile.is_verified}
									<span class="text-green-600 font-medium">Verified</span>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Admin Notes -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h3 class="font-display font-semibold text-[#1E1E2E] mb-4">Admin Notes</h3>
				<form
					method="POST"
					action="?/addNotes"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							isSubmitting = false;
							await update();
						};
					}}
				>
					<textarea
						name="admin_notes"
						bind:value={adminNotes}
						rows="4"
						placeholder="Add internal notes about this dispute..."
						class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 focus:outline-none resize-y"
					></textarea>
					<button
						type="submit"
						disabled={isSubmitting}
						class="mt-2 w-full px-4 py-2 text-sm bg-[#1E1E2E] text-white rounded-lg hover:bg-[#1E1E2E]/90 disabled:opacity-50 transition-colors"
					>
						Save Notes
					</button>
				</form>
			</div>

			<!-- Quick Status Update -->
			{#if !isResolved}
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 class="font-display font-semibold text-[#1E1E2E] mb-4">Update Status</h3>
					<form
						method="POST"
						action="?/updateStatus"
						use:enhance={() => {
							isSubmitting = true;
							return async ({ update }) => {
								isSubmitting = false;
								await update();
							};
						}}
						class="space-y-3"
					>
						<select
							name="status"
							class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 focus:outline-none"
						>
							<option value="open" selected={dispute.status === 'open'}>Open</option>
							<option value="under_review" selected={dispute.status === 'under_review'}>Under Review</option>
						</select>
						<button
							type="submit"
							disabled={isSubmitting}
							class="w-full px-4 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
						>
							Update Status
						</button>
					</form>
				</div>
			{/if}

			<!-- Resolution Actions -->
			{#if !isResolved}
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 class="font-display font-semibold text-[#1E1E2E] mb-4">Resolution Actions</h3>
					<div class="space-y-3">
						<!-- Refund -->
						<button
							class="w-full text-left px-4 py-3 rounded-lg border transition-colors {activeResolutionAction === 'refund' ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}"
							onclick={() => (activeResolutionAction = activeResolutionAction === 'refund' ? null : 'refund')}
						>
							<div class="flex items-center gap-3">
								<div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
									<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<div>
									<p class="text-sm font-medium text-gray-900">Issue Refund</p>
									<p class="text-xs text-gray-500">Refund the client</p>
								</div>
							</div>
						</button>

						{#if activeResolutionAction === 'refund'}
							<form
								method="POST"
								action="?/resolveRefund"
								use:enhance={() => {
									isSubmitting = true;
									return async ({ update }) => {
										isSubmitting = false;
										activeResolutionAction = null;
										await update();
									};
								}}
								class="pl-4 border-l-2 border-blue-300 space-y-3"
							>
								<div>
									<label for="refund_amount" class="block text-xs font-medium text-gray-700 mb-1">
										Refund Amount (GBP)
									</label>
									<div class="relative">
										<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">&#163;</span>
										<input
											id="refund_amount"
											name="refund_amount"
											type="number"
											step="0.01"
											min="0.01"
											bind:value={refundAmount}
											placeholder="0.00"
											required
											class="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2 text-sm text-gray-900 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 focus:outline-none"
										/>
									</div>
									{#if booking?.agreed_price_pence}
										<p class="text-xs text-gray-400 mt-1">
											Max: {formatPrice(booking.agreed_price_pence)}
										</p>
									{/if}
								</div>
								<div>
									<label for="refund_resolution" class="block text-xs font-medium text-gray-700 mb-1">
										Resolution Note
									</label>
									<textarea
										id="refund_resolution"
										name="resolution"
										bind:value={resolutionText}
										rows="2"
										placeholder="Describe the resolution..."
										class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 focus:outline-none resize-y"
									></textarea>
								</div>
								<button
									type="submit"
									disabled={isSubmitting || !refundAmount}
									class="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
								>
									Confirm Refund
								</button>
							</form>
						{/if}

						<!-- Warning -->
						<button
							class="w-full text-left px-4 py-3 rounded-lg border transition-colors {activeResolutionAction === 'warning' ? 'border-orange-300 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}"
							onclick={() => (activeResolutionAction = activeResolutionAction === 'warning' ? null : 'warning')}
						>
							<div class="flex items-center gap-3">
								<div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
									<svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
									</svg>
								</div>
								<div>
									<p class="text-sm font-medium text-gray-900">Issue Warning</p>
									<p class="text-xs text-gray-500">Warn the reported party</p>
								</div>
							</div>
						</button>

						{#if activeResolutionAction === 'warning'}
							<form
								method="POST"
								action="?/resolveWarning"
								use:enhance={() => {
									isSubmitting = true;
									return async ({ update }) => {
										isSubmitting = false;
										activeResolutionAction = null;
										await update();
									};
								}}
								class="pl-4 border-l-2 border-orange-300 space-y-3"
							>
								<div>
									<label for="warning_resolution" class="block text-xs font-medium text-gray-700 mb-1">
										Resolution Note
									</label>
									<textarea
										id="warning_resolution"
										name="resolution"
										rows="2"
										placeholder="Describe the warning and reason..."
										class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 focus:outline-none resize-y"
									></textarea>
								</div>
								<button
									type="submit"
									disabled={isSubmitting}
									class="w-full px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
								>
									Confirm Warning
								</button>
							</form>
						{/if}

						<!-- No Action -->
						<button
							class="w-full text-left px-4 py-3 rounded-lg border transition-colors {activeResolutionAction === 'no_action' ? 'border-gray-400 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'}"
							onclick={() => (activeResolutionAction = activeResolutionAction === 'no_action' ? null : 'no_action')}
						>
							<div class="flex items-center gap-3">
								<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
									<svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
									</svg>
								</div>
								<div>
									<p class="text-sm font-medium text-gray-900">No Action</p>
									<p class="text-xs text-gray-500">Dismiss the dispute</p>
								</div>
							</div>
						</button>

						{#if activeResolutionAction === 'no_action'}
							<form
								method="POST"
								action="?/resolveNoAction"
								use:enhance={() => {
									isSubmitting = true;
									return async ({ update }) => {
										isSubmitting = false;
										activeResolutionAction = null;
										await update();
									};
								}}
								class="pl-4 border-l-2 border-gray-400 space-y-3"
							>
								<div>
									<label for="no_action_resolution" class="block text-xs font-medium text-gray-700 mb-1">
										Resolution Note
									</label>
									<textarea
										id="no_action_resolution"
										name="resolution"
										rows="2"
										placeholder="Explain why no action is being taken..."
										class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 focus:outline-none resize-y"
									></textarea>
								</div>
								<button
									type="submit"
									disabled={isSubmitting}
									class="w-full px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
								>
									Confirm No Action
								</button>
							</form>
						{/if}

						<!-- Close -->
						<form
							method="POST"
							action="?/closeDispute"
							use:enhance={() => {
								isSubmitting = true;
								return async ({ update }) => {
									isSubmitting = false;
									await update();
								};
							}}
						>
							<input type="hidden" name="resolution" value="Dispute closed by admin" />
							<button
								type="submit"
								disabled={isSubmitting}
								class="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
							>
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
										<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<div>
										<p class="text-sm font-medium text-gray-900">Close Dispute</p>
										<p class="text-xs text-gray-500">Close without specific resolution</p>
									</div>
								</div>
							</button>
						</form>
					</div>
				</div>
			{/if}

			<!-- Related Disputes -->
			{#if data.relatedDisputes.length > 0}
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 class="font-display font-semibold text-[#1E1E2E] mb-3">
						Related Disputes ({data.relatedDisputes.length})
					</h3>
					<div class="space-y-2">
						{#each data.relatedDisputes as related}
							<a
								href="/admin/disputes/{related.id}"
								class="block px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
							>
								<div class="flex items-center justify-between">
									<span class="font-mono text-xs text-gray-600">{related.id.slice(0, 8)}</span>
									<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {getStatusBadgeClasses(related.status)}">
										{formatStatus(related.status)}
									</span>
								</div>
								<p class="text-xs text-gray-500 mt-1">{formatDateTime(related.created_at)}</p>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
