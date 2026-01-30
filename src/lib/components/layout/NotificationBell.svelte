<script lang="ts">
	import { getSupabaseBrowserClient } from '$lib/supabase';
	import type { Notification } from '$lib/types/database';

	let { userId }: { userId: string } = $props();

	let notifications = $state<Notification[]>([]);
	let unreadCount = $state(0);
	let isOpen = $state(false);
	let loading = $state(false);
	let dropdownEl: HTMLDivElement | undefined = $state();

	const typeIcons: Record<string, { icon: string; color: string }> = {
		booking_request: { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'text-blue-500' },
		booking_update: { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', color: 'text-amber-500' },
		message: { icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: 'text-green-500' },
		review: { icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: 'text-yellow-500' },
		dispute: { icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'text-red-500' },
		system: { icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-gray-500' },
		payment: { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-emerald-500' }
	};

	function timeAgo(dateString: string): string {
		const now = new Date();
		const date = new Date(dateString);
		const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (seconds < 60) return 'just now';
		if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
		if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
		if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
		return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
	}

	async function fetchNotifications() {
		loading = true;
		try {
			const res = await fetch('/api/notifications?limit=10');
			if (res.ok) {
				const data = await res.json();
				notifications = data.notifications;
				unreadCount = data.unread_count;
			}
		} catch (err) {
			console.error('Failed to fetch notifications:', err);
		} finally {
			loading = false;
		}
	}

	async function markAllAsRead() {
		try {
			const res = await fetch('/api/notifications', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ all: true })
			});
			if (res.ok) {
				notifications = notifications.map((n) => ({ ...n, read: true }));
				unreadCount = 0;
			}
		} catch (err) {
			console.error('Failed to mark all as read:', err);
		}
	}

	async function handleNotificationClick(notification: Notification) {
		// Mark as read if unread
		if (!notification.read) {
			try {
				await fetch('/api/notifications', {
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ ids: [notification.id] })
				});
				notifications = notifications.map((n) =>
					n.id === notification.id ? { ...n, read: true } : n
				);
				unreadCount = Math.max(0, unreadCount - 1);
			} catch (err) {
				console.error('Failed to mark notification as read:', err);
			}
		}

		// Navigate if link provided
		if (notification.link) {
			isOpen = false;
			window.location.href = notification.link;
		}
	}

	function toggleDropdown() {
		isOpen = !isOpen;
		if (isOpen && notifications.length === 0) {
			fetchNotifications();
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (dropdownEl && !dropdownEl.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	// Fetch initial unread count
	$effect(() => {
		if (userId) {
			fetchNotifications();
		}
	});

	// Subscribe to realtime notifications
	$effect(() => {
		if (!userId) return;

		const supabase = getSupabaseBrowserClient();
		const channel = supabase
			.channel('notifications')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'notifications',
					filter: `user_id=eq.${userId}`
				},
				(payload) => {
					const newNotification = payload.new as Notification;
					notifications = [newNotification, ...notifications.slice(0, 9)];
					unreadCount = unreadCount + 1;
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	});

	// Click outside listener
	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside, true);
			return () => {
				document.removeEventListener('click', handleClickOutside, true);
			};
		}
	});
</script>

<div class="relative" bind:this={dropdownEl}>
	<!-- Bell Button -->
	<button
		type="button"
		onclick={toggleDropdown}
		class="relative p-2 text-gray-600 hover:text-[#1E1E2E] transition-colors rounded-lg hover:bg-gray-50"
		aria-label="Notifications"
	>
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
		</svg>

		{#if unreadCount > 0}
			<span class="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#FF6B35] rounded-full leading-none">
				{unreadCount > 99 ? '99+' : unreadCount}
			</span>
		{/if}
	</button>

	<!-- Dropdown -->
	{#if isOpen}
		<div class="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden animate-fade-in">
			<!-- Header -->
			<div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
				<h3 class="text-sm font-semibold text-[#1E1E2E]">Notifications</h3>
				{#if unreadCount > 0}
					<button
						type="button"
						onclick={markAllAsRead}
						class="text-xs text-[#FF6B35] hover:text-[#e55a2a] font-medium transition-colors"
					>
						Mark all as read
					</button>
				{/if}
			</div>

			<!-- Notification List -->
			<div class="max-h-[400px] overflow-y-auto">
				{#if loading && notifications.length === 0}
					<div class="flex items-center justify-center py-8">
						<div class="w-5 h-5 border-2 border-gray-200 border-t-[#FF6B35] rounded-full animate-spin"></div>
					</div>
				{:else if notifications.length === 0}
					<div class="flex flex-col items-center justify-center py-8 px-4">
						<svg class="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
						</svg>
						<p class="text-sm text-gray-400">No notifications yet</p>
					</div>
				{:else}
					{#each notifications as notification (notification.id)}
						<button
							type="button"
							onclick={() => handleNotificationClick(notification)}
							class="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 {notification.read ? 'opacity-60' : ''}"
						>
							<!-- Type Icon -->
							<div class="flex-shrink-0 mt-0.5">
								<svg class="w-5 h-5 {typeIcons[notification.type]?.color ?? 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="{typeIcons[notification.type]?.icon ?? typeIcons.system.icon}" />
								</svg>
							</div>

							<!-- Content -->
							<div class="flex-1 min-w-0">
								<div class="flex items-start justify-between gap-2">
									<p class="text-sm font-medium text-[#1E1E2E] truncate {notification.read ? '' : 'font-semibold'}">
										{notification.title}
									</p>
									{#if !notification.read}
										<span class="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-[#FF6B35]"></span>
									{/if}
								</div>
								<p class="text-xs text-gray-500 line-clamp-2 mt-0.5">
									{notification.body}
								</p>
								<p class="text-[11px] text-gray-400 mt-1">
									{timeAgo(notification.created_at)}
								</p>
							</div>
						</button>
					{/each}
				{/if}
			</div>

			<!-- Footer -->
			{#if notifications.length > 0}
				<div class="border-t border-gray-100">
					<a
						href="/dashboard/notifications"
						class="block text-center py-2.5 text-xs font-medium text-[#FF6B35] hover:text-[#e55a2a] hover:bg-gray-50 transition-colors"
						onclick={() => { isOpen = false; }}
					>
						View all notifications
					</a>
				</div>
			{/if}
		</div>
	{/if}
</div>
