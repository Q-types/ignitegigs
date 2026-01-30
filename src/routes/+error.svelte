<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} - IgniteGigs</title>
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center px-4 py-12">
	<div class="text-center max-w-lg">
		{#if page.status === 404}
			<!-- 404 Not Found -->
			<div class="mb-6 flex justify-center">
				<div class="relative">
					<svg class="w-32 h-32 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
					</svg>
					<div class="absolute inset-0 flex items-center justify-center">
						<span class="text-5xl font-bold text-primary/40">?</span>
					</div>
				</div>
			</div>
			<p class="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Error 404</p>
			<h1 class="font-display text-4xl font-bold text-secondary mb-4">Page Not Found</h1>
			<p class="text-gray-600 mb-8 leading-relaxed">
				Looks like this page has burned out. The performer or page you're looking for might have moved or no longer exists.
			</p>
		{:else if page.status === 403}
			<!-- 403 Forbidden -->
			<div class="mb-6 flex justify-center">
				<div class="relative">
					<svg class="w-32 h-32 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
					<div class="absolute inset-0 flex items-center justify-center">
						<svg class="w-10 h-10 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
						</svg>
					</div>
				</div>
			</div>
			<p class="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Error 403</p>
			<h1 class="font-display text-4xl font-bold text-secondary mb-4">Access Denied</h1>
			<p class="text-gray-600 mb-8 leading-relaxed">
				You don't have permission to view this page. If you believe this is a mistake, please sign in or contact support.
			</p>
		{:else if page.status === 500}
			<!-- 500 Server Error -->
			<div class="mb-6 flex justify-center">
				<div class="relative">
					<svg class="w-32 h-32 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
					</svg>
					<div class="absolute inset-0 flex items-center justify-center">
						<svg class="w-10 h-10 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>
				</div>
			</div>
			<p class="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Error 500</p>
			<h1 class="font-display text-4xl font-bold text-secondary mb-4">Something Went Wrong</h1>
			<p class="text-gray-600 mb-8 leading-relaxed">
				We're having technical difficulties on our end. Our team has been notified and is working on a fix. Please try again shortly.
			</p>
		{:else}
			<!-- Generic Error -->
			<div class="mb-6 flex justify-center">
				<div class="relative">
					<svg class="w-32 h-32 text-primary/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<div class="absolute inset-0 flex items-center justify-center">
						<span class="text-3xl font-bold text-primary/40">{page.status}</span>
					</div>
				</div>
			</div>
			<p class="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Error {page.status}</p>
			<h1 class="font-display text-4xl font-bold text-secondary mb-4">Unexpected Error</h1>
			<p class="text-gray-600 mb-8 leading-relaxed">
				{page.error?.message || 'An unexpected error occurred. Please try again or contact support if the problem persists.'}
			</p>
		{/if}

		<!-- Action Buttons -->
		<div class="flex flex-col sm:flex-row gap-3 justify-center mb-8">
			<a href="/" class="btn-primary">
				<svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
				</svg>
				Go Home
			</a>
			<button onclick={() => history.back()} class="btn-outline">
				<svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				Go Back
			</button>
		</div>

		<!-- Contact Support -->
		<div class="border-t border-gray-200 pt-6">
			<p class="text-sm text-gray-500">
				Need help?
				<a href="/contact" class="text-primary hover:text-primary/80 font-medium transition-colors">
					Contact Support
				</a>
			</p>
		</div>
	</div>
</div>
