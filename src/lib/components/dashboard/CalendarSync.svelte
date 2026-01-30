<script lang="ts">
	let {
		performerId,
		performerName
	}: {
		performerId: string;
		performerName: string;
	} = $props();

	let copied = $state(false);
	let showInstructions = $state(false);
	let calendarUrl = $state('');
	let webcalUrl = $state('');
	let googleCalUrl = $state('');
	let platform = $state<'ios' | 'android' | 'desktop'>('desktop');

	$effect(() => {
		const origin = window.location.origin;
		calendarUrl = `${origin}/api/calendar/${performerId}`;
		webcalUrl = calendarUrl.replace(/^https?:\/\//, 'webcal://');
		googleCalUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`;

		// Detect platform
		const ua = navigator.userAgent;
		if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
			platform = 'ios';
		} else if (/Android/.test(ua)) {
			platform = 'android';
		} else {
			platform = 'desktop';
		}
	});

	async function copyUrl() {
		try {
			await navigator.clipboard.writeText(calendarUrl);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			const input = document.createElement('input');
			input.value = calendarUrl;
			document.body.appendChild(input);
			input.select();
			document.execCommand('copy');
			document.body.removeChild(input);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}

	function downloadIcs() {
		window.location.href = `${calendarUrl}?download=true`;
	}

	function subscribeApple() {
		window.location.href = webcalUrl;
	}

	function subscribeGoogle() {
		window.open(googleCalUrl, '_blank');
	}
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
	<h3 class="font-display text-lg font-semibold text-gray-900 mb-2">Calendar Sync</h3>
	<p class="text-sm text-gray-600 mb-4">
		Subscribe to your IgniteGigs calendar on your phone or desktop. Bookings and blocked dates
		update automatically every hour.
	</p>

	<div class="space-y-3">
		<!-- Primary: Platform-specific subscribe button -->
		{#if platform === 'ios'}
			<button onclick={subscribeApple} class="btn-primary w-full flex items-center justify-center gap-2">
				<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
					<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
				</svg>
				Subscribe on iPhone
			</button>
		{:else if platform === 'android'}
			<button onclick={subscribeGoogle} class="btn-primary w-full flex items-center justify-center gap-2">
				<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
					<path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
				</svg>
				Add to Google Calendar
			</button>
		{:else}
			<button onclick={subscribeApple} class="btn-primary w-full flex items-center justify-center gap-2">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
				Subscribe to Calendar
			</button>
		{/if}

		<!-- Secondary options -->
		<div class="grid grid-cols-2 gap-2">
			{#if platform !== 'ios'}
				<button onclick={subscribeApple} class="btn-outline btn-sm flex items-center justify-center gap-1.5 text-xs">
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
						<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
					</svg>
					Apple
				</button>
			{/if}
			{#if platform !== 'android'}
				<button onclick={subscribeGoogle} class="btn-outline btn-sm flex items-center justify-center gap-1.5 text-xs">
					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
					</svg>
					Google
				</button>
			{/if}
			<button onclick={downloadIcs} class="btn-outline btn-sm flex items-center justify-center gap-1.5 text-xs">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
				</svg>
				Download .ics
			</button>
		</div>

		<!-- Subscribe URL for advanced users -->
		<div>
			<button
				class="text-sm text-[#FF6B35] hover:text-[#FF6B35]/80 flex items-center gap-1 mb-2"
				onclick={() => (showInstructions = !showInstructions)}
			>
				{showInstructions ? 'Hide' : 'Advanced'}: Copy subscribe URL
				<svg
					class="w-4 h-4 transition-transform {showInstructions ? 'rotate-180' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{#if showInstructions}
				<div class="space-y-3">
					<div class="flex gap-2">
						<input
							type="text"
							value={calendarUrl}
							readonly
							class="input text-xs flex-1 bg-gray-50 text-gray-500"
						/>
						<button onclick={copyUrl} class="btn-outline px-3 text-xs">
							{copied ? 'Copied!' : 'Copy'}
						</button>
					</div>

					<div class="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-3">
						<div>
							<p class="font-medium mb-1">iPhone / iPad:</p>
							<ol class="list-decimal list-inside space-y-1 text-gray-600 text-xs">
								<li>Tap "Subscribe on iPhone" above, or:</li>
								<li>Go to Settings &gt; Calendar &gt; Accounts &gt; Add Account</li>
								<li>Choose "Other" &gt; "Add Subscribed Calendar"</li>
								<li>Paste the URL and tap Subscribe</li>
							</ol>
						</div>
						<div>
							<p class="font-medium mb-1">Android (Google Calendar):</p>
							<ol class="list-decimal list-inside space-y-1 text-gray-600 text-xs">
								<li>Tap "Add to Google Calendar" above, or:</li>
								<li>On desktop, go to Google Calendar settings</li>
								<li>Click "Add calendar" &gt; "From URL"</li>
								<li>Paste the URL and click "Add calendar"</li>
								<li>It will auto-sync to your phone</li>
							</ol>
						</div>
						<div>
							<p class="font-medium mb-1">Outlook:</p>
							<ol class="list-decimal list-inside space-y-1 text-gray-600 text-xs">
								<li>Open Outlook Calendar</li>
								<li>Go to Add calendar &gt; Subscribe from web</li>
								<li>Paste the URL and click Import</li>
							</ol>
						</div>

						<div class="bg-primary/5 rounded-lg p-3 mt-2">
							<p class="text-xs text-gray-700">
								<span class="font-medium">Auto-sync:</span> Subscribed calendars refresh automatically.
								New bookings and availability changes will appear on your phone within an hour.
							</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
