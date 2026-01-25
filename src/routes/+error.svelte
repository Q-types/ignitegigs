<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} - IgniteGigs</title>
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center px-4">
	<div class="text-center max-w-md">
		{#if page.status === 404}
			<div class="text-8xl mb-4">
				<span class="inline-block animate-pulse">&#128293;</span>
			</div>
			<h1 class="font-display text-4xl font-bold text-secondary mb-4">Page Not Found</h1>
			<p class="text-gray-600 mb-8">
				Looks like this page has burned out. The performer you're looking for might have moved on.
			</p>
		{:else if page.status === 500}
			<div class="text-8xl mb-4">
				<span class="inline-block">&#9888;&#65039;</span>
			</div>
			<h1 class="font-display text-4xl font-bold text-secondary mb-4">Something Went Wrong</h1>
			<p class="text-gray-600 mb-8">
				We're having technical difficulties. Please try again in a moment.
			</p>
		{:else}
			<div class="text-8xl mb-4">
				<span class="inline-block">&#128533;</span>
			</div>
			<h1 class="font-display text-4xl font-bold text-secondary mb-4">Error {page.status}</h1>
			<p class="text-gray-600 mb-8">
				{page.error?.message || 'An unexpected error occurred.'}
			</p>
		{/if}

		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a href="/" class="btn-primary">
				Go Home
			</a>
			<a href="/performers" class="btn-outline">
				Browse Performers
			</a>
		</div>
	</div>
</div>
