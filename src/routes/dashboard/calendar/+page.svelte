<script lang="ts">
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { Modal, Badge } from '$lib/components/ui';
	import type { ActionData } from './$types';

	let { data, form }: { data: typeof import('./$types').PageData; form: ActionData } = $props();

	let selectedDate = $state<string | null>(null);
	let showDayModal = $state(false);
	let selectedDates = $state<Set<string>>(new Set());
	let isMultiSelect = $state(false);

	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	// Generate calendar days
	let calendarDays = $derived.by(() => {
		const firstDayOfMonth = new Date(data.year, data.month - 1, 1);
		const lastDayOfMonth = new Date(data.year, data.month, 0);
		const startingDay = firstDayOfMonth.getDay();
		const totalDays = lastDayOfMonth.getDate();

		const days: Array<{ date: string | null; day: number | null }> = [];

		// Add empty cells for days before the first of the month
		for (let i = 0; i < startingDay; i++) {
			days.push({ date: null, day: null });
		}

		// Add days of the month
		for (let day = 1; day <= totalDays; day++) {
			const date = `${data.year}-${String(data.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
			days.push({ date, day });
		}

		return days;
	});

	function getDateStatus(date: string): 'available' | 'unavailable' | 'booked' | 'default' {
		const booking = data.bookings.find((b) => b.event_date === date);
		if (booking) return 'booked';

		const avail = data.availability.find((a) => a.date === date);
		if (avail) {
			return avail.is_available ? 'available' : 'unavailable';
		}

		return 'default';
	}

	function getBookingForDate(date: string) {
		return data.bookings.find((b) => b.event_date === date);
	}

	function getAvailabilityForDate(date: string) {
		return data.availability.find((a) => a.date === date);
	}

	function prevMonth() {
		let newMonth = data.month - 1;
		let newYear = data.year;
		if (newMonth < 1) {
			newMonth = 12;
			newYear--;
		}
		goto(`/dashboard/calendar?month=${newYear}-${newMonth}`);
	}

	function nextMonth() {
		let newMonth = data.month + 1;
		let newYear = data.year;
		if (newMonth > 12) {
			newMonth = 1;
			newYear++;
		}
		goto(`/dashboard/calendar?month=${newYear}-${newMonth}`);
	}

	function selectDate(date: string) {
		if (isMultiSelect) {
			if (selectedDates.has(date)) {
				selectedDates.delete(date);
			} else {
				selectedDates.add(date);
			}
			selectedDates = new Set(selectedDates);
		} else {
			selectedDate = date;
			showDayModal = true;
		}
	}

	function toggleMultiSelect() {
		isMultiSelect = !isMultiSelect;
		selectedDates = new Set();
	}

	function isPastDate(date: string): boolean {
		const today = new Date().toISOString().split('T')[0];
		return date < today;
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-secondary">Availability Calendar</h1>
			<p class="text-gray-600">Manage your availability for bookings</p>
		</div>
		<button
			class="btn-outline btn-sm {isMultiSelect ? 'bg-primary/10 border-primary text-primary' : ''}"
			onclick={toggleMultiSelect}
		>
			{isMultiSelect ? 'Cancel Multi-Select' : 'Select Multiple Days'}
		</button>
	</div>

	<!-- Success Message -->
	{#if form?.success}
		<div class="p-4 bg-success/10 text-success rounded-lg">
			{form.message || 'Updated successfully'}
		</div>
	{/if}

	<!-- Legend -->
	<div class="flex flex-wrap gap-4 text-sm">
		<div class="flex items-center gap-2">
			<span class="w-4 h-4 bg-success/20 border-2 border-success rounded"></span>
			<span class="text-gray-600">Available</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="w-4 h-4 bg-gray-200 border-2 border-gray-300 rounded"></span>
			<span class="text-gray-600">Unavailable</span>
		</div>
		<div class="flex items-center gap-2">
			<span class="w-4 h-4 bg-primary/20 border-2 border-primary rounded"></span>
			<span class="text-gray-600">Booked</span>
		</div>
	</div>

	<!-- Calendar -->
	<div class="bg-white rounded-card shadow-card overflow-hidden">
		<!-- Month Navigation -->
		<div class="flex items-center justify-between p-4 border-b border-gray-100">
			<button class="p-2 hover:bg-gray-100 rounded-lg" onclick={prevMonth}>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
			<h2 class="font-display text-xl font-semibold text-secondary">
				{monthNames[data.month - 1]} {data.year}
			</h2>
			<button class="p-2 hover:bg-gray-100 rounded-lg" onclick={nextMonth}>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>

		<!-- Day Headers -->
		<div class="grid grid-cols-7 bg-gray-50">
			{#each dayNames as day}
				<div class="p-3 text-center text-sm font-medium text-gray-500">
					{day}
				</div>
			{/each}
		</div>

		<!-- Calendar Grid -->
		<div class="grid grid-cols-7">
			{#each calendarDays as { date, day }}
				{#if date}
					{@const status = getDateStatus(date)}
					{@const booking = getBookingForDate(date)}
					{@const isPast = isPastDate(date)}
					{@const isSelected = selectedDates.has(date)}
					<button
						class="aspect-square p-2 border-t border-r border-gray-100 text-left transition-colors relative
							{isPast ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
							{status === 'available' ? 'bg-success/10' : ''}
							{status === 'unavailable' ? 'bg-gray-100' : ''}
							{status === 'booked' ? 'bg-primary/10' : ''}
							{isSelected ? 'ring-2 ring-primary ring-inset' : ''}"
						disabled={isPast}
						onclick={() => !isPast && selectDate(date)}
					>
						<span class="text-sm font-medium {status === 'booked' ? 'text-primary' : ''}">{day}</span>
						{#if booking}
							<div class="mt-1">
								<span class="text-xs text-primary truncate block">
									{booking.event_type || 'Booking'}
								</span>
							</div>
						{/if}
					</button>
				{:else}
					<div class="aspect-square border-t border-r border-gray-100 bg-gray-50"></div>
				{/if}
			{/each}
		</div>
	</div>

	<!-- Multi-Select Actions -->
	{#if isMultiSelect && selectedDates.size > 0}
		<div class="bg-white rounded-card shadow-card p-4">
			<p class="text-sm text-gray-600 mb-4">
				{selectedDates.size} date{selectedDates.size > 1 ? 's' : ''} selected
			</p>
			<form method="POST" action="?/bulkUpdate" use:enhance class="flex gap-3">
				{#each Array.from(selectedDates) as date}
					<input type="hidden" name="dates" value={date} />
				{/each}
				<button type="submit" name="isAvailable" value="true" class="btn-primary btn-sm">
					Mark Available
				</button>
				<button type="submit" name="isAvailable" value="false" class="btn-outline btn-sm">
					Mark Unavailable
				</button>
			</form>
		</div>
	{/if}
</div>

<!-- Day Detail Modal -->
<Modal bind:open={showDayModal} title={selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : ''}>
	{#if selectedDate}
		{@const booking = getBookingForDate(selectedDate)}
		{@const avail = getAvailabilityForDate(selectedDate)}
		{@const status = getDateStatus(selectedDate)}

		{#if booking}
			<div class="mb-4 p-4 bg-primary/10 rounded-lg">
				<div class="flex items-center justify-between mb-2">
					<span class="font-semibold text-primary">Booked</span>
					<Badge variant="info">{booking.status}</Badge>
				</div>
				<p class="text-sm text-gray-600">
					{booking.event_type || 'Event'} - {booking.client?.full_name || 'Client'}
				</p>
				<a href="/dashboard/bookings/{booking.id}" class="text-sm text-primary hover:underline mt-2 inline-block">
					View booking details
				</a>
			</div>
		{/if}

		<form
			method="POST"
			action="?/updateAvailability"
			use:enhance={() => {
				return async ({ update }) => {
					showDayModal = false;
					await update();
				};
			}}
			class="space-y-4"
		>
			<input type="hidden" name="date" value={selectedDate} />

			<div class="flex gap-4">
				<label class="flex-1">
					<input
						type="radio"
						name="isAvailable"
						value="true"
						checked={status !== 'unavailable'}
						class="sr-only peer"
					/>
					<div class="p-4 rounded-lg border-2 cursor-pointer transition-all peer-checked:border-success peer-checked:bg-success/5 border-gray-200 hover:border-gray-300">
						<div class="flex items-center gap-3">
							<div class="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
								<svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<span class="font-medium">Available</span>
						</div>
					</div>
				</label>

				<label class="flex-1">
					<input
						type="radio"
						name="isAvailable"
						value="false"
						checked={status === 'unavailable'}
						class="sr-only peer"
					/>
					<div class="p-4 rounded-lg border-2 cursor-pointer transition-all peer-checked:border-gray-500 peer-checked:bg-gray-50 border-gray-200 hover:border-gray-300">
						<div class="flex items-center gap-3">
							<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
								<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</div>
							<span class="font-medium">Unavailable</span>
						</div>
					</div>
				</label>
			</div>

			<div>
				<label for="notes" class="label">Notes (optional)</label>
				<input
					id="notes"
					name="notes"
					type="text"
					value={avail?.notes ?? ''}
					class="input"
					placeholder="e.g., Only evening available"
				/>
			</div>

			<div class="flex gap-3">
				<button type="button" class="btn-outline flex-1" onclick={() => (showDayModal = false)}>
					Cancel
				</button>
				<button type="submit" class="btn-primary flex-1">
					Save
				</button>
			</div>
		</form>
	{/if}
</Modal>
