<script lang="ts">
	import { browser } from '$app/environment';

	const STORAGE_KEY = 'cookie-consent';

	let analyticsEnabled = $state(false);
	let marketingEnabled = $state(false);

	$effect(() => {
		if (!browser) return;

		try {
			const consent = localStorage.getItem(STORAGE_KEY);
			if (consent) {
				const parsed = JSON.parse(consent);
				analyticsEnabled = !!parsed.analytics;
				marketingEnabled = !!parsed.marketing;
			}
		} catch {
			// Consent not available or malformed — do not load any optional scripts
		}
	});
</script>

<svelte:head>
	{#if analyticsEnabled}
		<!-- Google Analytics — replace GA_ID with your real Measurement ID (e.g. G-XXXXXXXXXX) -->
		<!-- <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script> -->
		<!-- <script>
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', 'GA_ID');
		</script> -->
	{/if}

	{#if marketingEnabled}
		<!-- Marketing / ad scripts go here (e.g. Meta Pixel, Google Ads tag) -->
		<!-- Only loaded when the user has opted in to marketing cookies -->
	{/if}
</svelte:head>
