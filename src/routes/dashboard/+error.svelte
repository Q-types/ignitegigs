<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Error - Dashboard - IgniteGigs</title>
</svelte:head>

<div class="max-w-lg mx-auto py-12">
	<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
		{#if page.status === 404}
			<div class="w-14 h-14 mx-auto mb-5 bg-amber-50 rounded-full flex items-center justify-center">
				<svg class="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
				</svg>
			</div>
			<p class="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">404</p>
			<h1 class="text-xl font-semibold text-secondary mb-2">Page Not Found</h1>
			<p class="text-sm text-gray-500 mb-6">
				This dashboard page doesn't exist or may have been moved.
			</p>
		{:else if page.status === 403}
			<div class="w-14 h-14 mx-auto mb-5 bg-red-50 rounded-full flex items-center justify-center">
				<svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
				</svg>
			</div>
			<p class="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">403</p>
			<h1 class="text-xl font-semibold text-secondary mb-2">Access Denied</h1>
			<p class="text-sm text-gray-500 mb-6">
				You don't have permission to access this section. Check that you're signed in to the right account.
			</p>
		{:else if page.status === 500}
			<div class="w-14 h-14 mx-auto mb-5 bg-red-50 rounded-full flex items-center justify-center">
				<svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
				</svg>
			</div>
			<p class="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">500</p>
			<h1 class="text-xl font-semibold text-secondary mb-2">Something Went Wrong</h1>
			<p class="text-sm text-gray-500 mb-6">
				We ran into an issue loading this page. This is on our end -- please try again in a moment.
			</p>
		{:else}
			<div class="w-14 h-14 mx-auto mb-5 bg-gray-100 rounded-full flex items-center justify-center">
				<svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Error {page.status}</p>
			<h1 class="text-xl font-semibold text-secondary mb-2">Unexpected Error</h1>
			<p class="text-sm text-gray-500 mb-6">
				{page.error?.message || 'Something unexpected happened. Please try again.'}
			</p>
		{/if}

		<!-- Actions -->
		<div class="flex flex-col sm:flex-row gap-3 justify-center">
			<a href="/dashboard" class="btn-primary">
				<svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
				</svg>
				Return to Dashboard
			</a>
			<button onclick={() => location.reload()} class="btn-outline">
				<svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
				</svg>
				Reload Page
			</button>
		</div>

		<!-- Help text -->
		<p class="text-xs text-gray-400 mt-6">
			If this keeps happening,
			<a href="/contact" class="text-primary hover:text-primary/80 transition-colors">contact support</a>.
		</p>
	</div>
</div>
