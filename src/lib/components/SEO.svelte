<script lang="ts">
	interface Props {
		title?: string;
		description?: string;
		image?: string;
		type?: 'website' | 'profile' | 'article';
		noindex?: boolean;
	}

	let {
		title = 'IgniteGigs - Book Fire & LED Performers Directly',
		description = 'The performer-owned platform where entertainers keep 92% and clients skip the agency markup.',
		image = '/og-image.png',
		type = 'website',
		noindex = false
	}: Props = $props();

	const fullTitle = title.includes('IgniteGigs') ? title : `${title} | IgniteGigs`;
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:type" content={type} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}
</svelte:head>
