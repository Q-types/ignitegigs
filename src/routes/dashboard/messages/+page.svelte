<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Avatar, Badge } from '$lib/components/ui';
	import type { ActionData } from './$types';

	let { data, form }: { data: typeof import('./$types').PageData; form: ActionData } = $props();

	let messageInput = $state('');
	let showChat = $state(!!data.selectedBookingId);
	let messagesContainer: HTMLDivElement | undefined = $state();
	let isSending = $state(false);

	// Derive the selected conversation from data
	const selectedConversation = $derived(
		data.selectedBookingId
			? data.conversations.find((c) => c.booking.id === data.selectedBookingId)
			: null
	);

	// Determine if the current user is the performer in a given booking
	function isPerformerInBooking(booking: any): boolean {
		return booking.performer?.user?.id === data.user?.id;
	}

	// Get the other party's details for a conversation
	function getOtherParty(booking: any): { name: string; avatarUrl: string | null } {
		if (isPerformerInBooking(booking)) {
			return {
				name: booking.client?.full_name || 'Client',
				avatarUrl: booking.client?.avatar_url || null
			};
		}
		return {
			name: booking.performer?.stage_name || booking.performer?.user?.full_name || 'Performer',
			avatarUrl: booking.performer?.user?.avatar_url || null
		};
	}

	// Format relative time: "Just now", "2m ago", "1h ago", "Yesterday", "Mon 12 Jan"
	function formatTimeAgo(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffSecs = Math.floor(diffMs / 1000);
		const diffMins = Math.floor(diffSecs / 60);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffSecs < 60) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 7) {
			return date.toLocaleDateString('en-GB', { weekday: 'short' });
		}
		return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
	}

	// Format message timestamp in the chat thread
	function formatMessageTime(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const isToday = date.toDateString() === now.toDateString();
		const yesterday = new Date(now);
		yesterday.setDate(yesterday.getDate() - 1);
		const isYesterday = date.toDateString() === yesterday.toDateString();

		const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

		if (isToday) return time;
		if (isYesterday) return `Yesterday ${time}`;
		return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ` ${time}`;
	}

	// Format event date for the booking context header
	function formatEventDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			weekday: 'short',
			day: 'numeric',
			month: 'short',
			year: 'numeric'
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

	function selectConversation(bookingId: string) {
		showChat = true;
		goto(`/dashboard/messages?booking=${bookingId}`, { replaceState: true });
	}

	function goBackToList() {
		showChat = false;
		goto('/dashboard/messages', { replaceState: true });
	}

	// Scroll to bottom of messages container
	function scrollToBottom() {
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}

	// Auto-scroll when messages change or on mount
	$effect(() => {
		if (data.messages.length > 0) {
			// Use tick-like delay to ensure DOM has updated
			setTimeout(scrollToBottom, 50);
		}
	});

	// Check if a message is from the current user
	function isOwnMessage(senderId: string): boolean {
		return senderId === data.user?.id;
	}

	// Group messages by date for date separators
	function getDateLabel(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const isToday = date.toDateString() === now.toDateString();
		const yesterday = new Date(now);
		yesterday.setDate(yesterday.getDate() - 1);
		const isYesterday = date.toDateString() === yesterday.toDateString();

		if (isToday) return 'Today';
		if (isYesterday) return 'Yesterday';
		return date.toLocaleDateString('en-GB', {
			weekday: 'long',
			day: 'numeric',
			month: 'long'
		});
	}

	function shouldShowDateSeparator(index: number): boolean {
		if (index === 0) return true;
		const prevDate = new Date(data.messages[index - 1].created_at).toDateString();
		const currDate = new Date(data.messages[index].created_at).toDateString();
		return prevDate !== currDate;
	}

	// Truncate text helper
	function truncate(text: string, maxLength: number): string {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength).trimEnd() + '...';
	}

	// Total unread count across all conversations
	const totalUnread = $derived(
		data.conversations.reduce((sum, c) => sum + c.unreadCount, 0)
	);
</script>

<svelte:head>
	<title>Messages - IgniteGigs</title>
</svelte:head>

<div class="space-y-4">
	<!-- Header (visible on desktop always, on mobile only when showing list) -->
	<div class="flex items-center justify-between {showChat ? 'hidden lg:flex' : ''}">
		<div>
			<h1 class="font-display text-2xl font-bold text-secondary">Messages</h1>
			<p class="text-gray-600">
				{#if totalUnread > 0}
					{totalUnread} unread {totalUnread === 1 ? 'message' : 'messages'}
				{:else}
					Your booking conversations
				{/if}
			</p>
		</div>
	</div>

	<!-- Error display -->
	{#if form?.error}
		<div class="bg-error/10 border border-error/30 rounded-lg p-4 text-error text-sm" role="alert">
			{form.error}
		</div>
	{/if}

	<!-- Main messaging layout -->
	<div class="bg-white rounded-card shadow-card overflow-hidden" style="height: calc(100vh - 220px); min-height: 500px;">
		<div class="flex h-full">

			<!-- Conversation List Panel -->
			<div
				class="w-full lg:w-96 lg:min-w-[24rem] border-r border-gray-200 flex flex-col {showChat ? 'hidden lg:flex' : 'flex'}"
				role="navigation"
				aria-label="Conversations"
			>
				<!-- Search / List Header -->
				<div class="p-4 border-b border-gray-100 flex-shrink-0">
					<h2 class="font-display text-lg font-semibold text-secondary">Conversations</h2>
				</div>

				<!-- Conversation Items -->
				<div class="flex-1 overflow-y-auto" role="list" aria-label="Conversation list">
					{#if data.conversations.length > 0}
						{#each data.conversations as conversation (conversation.booking.id)}
							{@const otherParty = getOtherParty(conversation.booking)}
							{@const isSelected = data.selectedBookingId === conversation.booking.id}
							<button
								type="button"
								class="w-full text-left p-4 flex items-start gap-3 transition-colors border-b border-gray-50 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none {isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : ''}"
								onclick={() => selectConversation(conversation.booking.id)}
								aria-label="Conversation with {otherParty.name} about {conversation.booking.event_type || 'booking'}"
								aria-current={isSelected ? 'true' : undefined}
								role="listitem"
							>
								<!-- Avatar -->
								<div class="relative flex-shrink-0">
									<Avatar
										src={otherParty.avatarUrl}
										name={otherParty.name}
										size="md"
									/>
									{#if conversation.unreadCount > 0}
										<span
											class="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center"
											aria-label="{conversation.unreadCount} unread"
										>
											{conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
										</span>
									{/if}
								</div>

								<!-- Content -->
								<div class="flex-1 min-w-0">
									<div class="flex items-center justify-between gap-2 mb-0.5">
										<span class="font-medium text-gray-900 truncate {conversation.unreadCount > 0 ? 'font-semibold' : ''}">
											{otherParty.name}
										</span>
										<span class="text-xs text-gray-400 flex-shrink-0">
											{#if conversation.lastMessage}
												{formatTimeAgo(conversation.lastMessage.created_at)}
											{/if}
										</span>
									</div>

									<!-- Event type + status -->
									<div class="flex items-center gap-2 mb-1">
										<span class="text-xs text-gray-500 truncate">
											{conversation.booking.event_type || 'Booking'}
										</span>
										<Badge variant={getStatusColor(conversation.booking.status)} size="sm">
											{conversation.booking.status}
										</Badge>
									</div>

									<!-- Last message preview -->
									{#if conversation.lastMessage}
										<p class="text-sm truncate {conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}">
											{#if conversation.lastMessage.sender_id === data.user?.id}
												<span class="text-gray-400">You: </span>
											{/if}
											{truncate(conversation.lastMessage.content, 60)}
										</p>
									{:else}
										<p class="text-sm text-gray-400 italic">No messages yet</p>
									{/if}
								</div>
							</button>
						{/each}
					{:else}
						<!-- Empty conversations state -->
						<div class="flex flex-col items-center justify-center h-full p-8 text-center">
							<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
								<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
								</svg>
							</div>
							<h3 class="font-display text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
							<p class="text-gray-500 text-sm mb-4">
								Messages will appear here when you have active bookings.
							</p>
							<a href="/performers" class="btn-primary btn-sm px-4 py-2">
								Find Performers
							</a>
						</div>
					{/if}
				</div>
			</div>

			<!-- Chat Panel -->
			<div
				class="flex-1 flex flex-col {showChat ? 'flex' : 'hidden lg:flex'}"
				role="main"
				aria-label="Chat messages"
			>
				{#if selectedConversation && data.selectedBookingId}
					{@const otherParty = getOtherParty(selectedConversation.booking)}

					<!-- Chat Header -->
					<div class="flex items-center gap-3 p-4 border-b border-gray-100 flex-shrink-0 bg-white">
						<!-- Back button (mobile only) -->
						<button
							type="button"
							class="lg:hidden p-1.5 -ml-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
							onclick={goBackToList}
							aria-label="Back to conversations"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
							</svg>
						</button>

						<!-- Other party info -->
						<Avatar
							src={otherParty.avatarUrl}
							name={otherParty.name}
							size="sm"
						/>
						<div class="flex-1 min-w-0">
							<h3 class="font-semibold text-gray-900 truncate">{otherParty.name}</h3>
							<div class="flex items-center gap-2 text-xs text-gray-500">
								<span>{selectedConversation.booking.event_type || 'Booking'}</span>
								<span aria-hidden="true">&#183;</span>
								<span>{formatEventDate(selectedConversation.booking.event_date)}</span>
								{#if selectedConversation.booking.event_location}
									<span aria-hidden="true">&#183;</span>
									<span class="truncate">{selectedConversation.booking.event_location}</span>
								{/if}
							</div>
						</div>

						<!-- Status badge and link to booking -->
						<div class="flex items-center gap-2 flex-shrink-0">
							<Badge variant={getStatusColor(selectedConversation.booking.status)}>
								{selectedConversation.booking.status}
							</Badge>
							<a
								href="/dashboard/bookings/{selectedConversation.booking.id}"
								class="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
								title="View booking details"
								aria-label="View booking details"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</a>
						</div>
					</div>

					<!-- Messages Area -->
					<div
						class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1"
						bind:this={messagesContainer}
						role="log"
						aria-label="Message history"
						aria-live="polite"
					>
						{#if data.messages.length > 0}
							{#each data.messages as message, index (message.id)}
								<!-- Date separator -->
								{#if shouldShowDateSeparator(index)}
									<div class="flex items-center gap-3 py-3" role="separator">
										<div class="flex-1 h-px bg-gray-200"></div>
										<span class="text-xs font-medium text-gray-400 flex-shrink-0">
											{getDateLabel(message.created_at)}
										</span>
										<div class="flex-1 h-px bg-gray-200"></div>
									</div>
								{/if}

								<!-- Message bubble -->
								{@const own = isOwnMessage(message.sender_id)}
								{@const isSystem = message.message_type === 'system'}
								{#if isSystem}
									<div class="flex justify-center py-2">
										<span class="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
											{message.content}
										</span>
									</div>
								{:else}
									<div class="flex gap-2.5 {own ? 'flex-row-reverse' : ''} mb-1">
										<!-- Avatar (only show for received messages or on first in group) -->
										<div class="flex-shrink-0 w-8 mt-auto">
											{#if !own}
												<Avatar
													src={message.sender?.avatar_url}
													name={message.sender?.full_name || 'User'}
													size="sm"
												/>
											{/if}
										</div>

										<!-- Bubble -->
										<div class="max-w-[75%] sm:max-w-[65%] {own ? 'items-end' : 'items-start'} flex flex-col">
											{#if !own}
												<span class="text-xs text-gray-500 mb-0.5 ml-1">
													{message.sender?.full_name || 'User'}
												</span>
											{/if}
											<div
												class="inline-block px-4 py-2.5 rounded-2xl break-words {own
													? 'bg-primary text-white rounded-br-md'
													: 'bg-gray-100 text-gray-900 rounded-bl-md'}"
											>
												<p class="text-sm whitespace-pre-wrap">{message.content}</p>
											</div>
											<span class="text-[11px] text-gray-400 mt-0.5 {own ? 'mr-1 text-right' : 'ml-1'}">
												{formatMessageTime(message.created_at)}
												{#if own && message.read_at}
													<span class="ml-1 text-primary/70" title="Read">&#10003;&#10003;</span>
												{/if}
											</span>
										</div>
									</div>
								{/if}
							{/each}
						{:else}
							<!-- No messages in this conversation -->
							<div class="flex flex-col items-center justify-center h-full text-center py-12">
								<div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
									<svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
									</svg>
								</div>
								<p class="text-gray-900 font-medium mb-1">No messages yet</p>
								<p class="text-gray-500 text-sm">Send a message to start the conversation with {otherParty.name}.</p>
							</div>
						{/if}
					</div>

					<!-- Message Input -->
					<div class="border-t border-gray-100 p-4 flex-shrink-0 bg-white">
						<form
							method="POST"
							action="?/send"
							use:enhance={() => {
								isSending = true;
								return async ({ result, update }) => {
									isSending = false;
									if (result.type === 'success') {
										messageInput = '';
									}
									await update({ reset: false });
									setTimeout(scrollToBottom, 100);
								};
							}}
						>
							<input type="hidden" name="bookingId" value={data.selectedBookingId} />
							<div class="flex items-end gap-3">
								<div class="flex-1">
									<label for="message-input" class="sr-only">Type a message</label>
									<textarea
										id="message-input"
										name="content"
										bind:value={messageInput}
										placeholder="Type your message..."
										rows="1"
										maxlength="5000"
										class="w-full px-4 py-2.5 border border-gray-200 rounded-2xl bg-white text-gray-900 placeholder-gray-400 transition-colors resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
										onkeydown={(e) => {
											if (e.key === 'Enter' && !e.shiftKey) {
												e.preventDefault();
												if (messageInput.trim() && !isSending) {
													const form = e.currentTarget.closest('form');
													if (form) form.requestSubmit();
												}
											}
										}}
										oninput={(e) => {
											const target = e.currentTarget;
											target.style.height = 'auto';
											target.style.height = Math.min(target.scrollHeight, 120) + 'px';
										}}
										aria-label="Message content"
									></textarea>
								</div>
								<button
									type="submit"
									disabled={!messageInput.trim() || isSending}
									class="btn-primary p-2.5 rounded-full flex-shrink-0 disabled:opacity-40"
									aria-label="Send message"
								>
									{#if isSending}
										<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
									{:else}
										<!-- Paper plane icon -->
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
										</svg>
									{/if}
								</button>
							</div>
							{#if messageInput.length > 4500}
								<p class="text-xs text-gray-400 mt-1 text-right">
									{messageInput.length}/5000 characters
								</p>
							{/if}
						</form>
					</div>
				{:else}
					<!-- No conversation selected (desktop only) -->
					<div class="flex flex-col items-center justify-center h-full text-center p-8">
						<div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
							<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
							</svg>
						</div>
						<h3 class="font-display text-xl font-semibold text-gray-900 mb-2">
							Select a conversation
						</h3>
						<p class="text-gray-500 max-w-sm">
							Choose a conversation from the list to view messages and continue the discussion about your booking.
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
