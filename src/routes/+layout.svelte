<script lang="ts">
	import '../app.css';
	import Header from '$components/layout/Header.svelte';
	import Footer from '$components/layout/Footer.svelte';
	import CookieConsent from '$components/layout/CookieConsent.svelte';
	import Analytics from '$components/layout/Analytics.svelte';

	let { children, data } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<Header user={data.user} />

	<main class="flex-1">
		{@render children()}
	</main>

	<Footer />
	<CookieConsent />
	<Analytics />
</div>
