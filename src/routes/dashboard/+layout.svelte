<script lang="ts">
	import { page } from '$app/stores';
	import type { User, PerformerProfile } from '$lib/types/database';
	import type { Session, User as AuthUser } from '@supabase/supabase-js';
	import type { Snippet } from 'svelte';

	interface DashboardData {
		user: User | null;
		authUser: AuthUser | null;
		session: Session | null;
		performerProfile: PerformerProfile | null;
		hasPerformerProfile: boolean;
		isClient: boolean;
		isPerformer: boolean;
		clientBookingsCount: number;
		needsOnboarding: boolean;
	}

	let { children, data }: { children: Snippet; data: DashboardData } = $props();

	let onboardingBannerDismissed = $state(false);

	// All possible nav items with role visibility
	const allNavItems = [
		{ href: '/dashboard', label: 'Overview', icon: 'home', roles: ['performer', 'client'] },
		{ href: '/dashboard/analytics', label: 'Analytics', icon: 'chart', roles: ['performer'] },
		{ href: '/dashboard/profile', label: 'Profile', icon: 'user', roles: ['performer'] },
		{ href: '/dashboard/verification', label: 'Verification', icon: 'shield', roles: ['performer'] },
		{ href: '/dashboard/bookings', label: 'Bookings', icon: 'calendar-check', roles: ['performer'] },
		{ href: '/dashboard/my-bookings', label: 'My Bookings', icon: 'ticket', roles: ['client'] },
		{ href: '/dashboard/calendar', label: 'Calendar', icon: 'calendar', roles: ['performer'] },
		{ href: '/dashboard/media', label: 'Media', icon: 'video', roles: ['performer'] },
		{ href: '/dashboard/messages', label: 'Messages', icon: 'message', roles: ['performer', 'client'] },
		{ href: '/dashboard/notifications', label: 'Notifications', icon: 'bell', roles: ['performer', 'client'] },
		{ href: '/dashboard/settings', label: 'Settings', icon: 'settings', roles: ['performer', 'client'] }
	];

	// Filter nav items based on user role
	let navItems = $derived(
		allNavItems.filter((item) => {
			if (data.isPerformer && data.isClient) return true; // 'both' sees everything
			if (data.isPerformer && item.roles.includes('performer')) return true;
			if (data.isClient && item.roles.includes('client')) return true;
			return false;
		})
	);

	let mobileNavOpen = $state(false);

	function isActiveRoute(href: string): boolean {
		if (href === '/dashboard') {
			return $page.url.pathname === '/dashboard';
		}
		return $page.url.pathname.startsWith(href);
	}

	function getIcon(icon: string): string {
		const icons: Record<string, string> = {
			home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
			chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
			user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
			shield:
				'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			'calendar-check':
				'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
			ticket:
				'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
			calendar:
				'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
			video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
			message:
				'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
			bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
			settings:
				'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
		};
		return icons[icon] || icons.home;
	}

	// Display name: performer stage name if performer, otherwise user full name
	let displayName = $derived(
		data.isPerformer && data.performerProfile?.stage_name
			? data.performerProfile.stage_name
			: data.user?.full_name || 'User'
	);

	let displaySubtext = $derived(
		data.isPerformer && data.performerProfile?.location_name
			? data.performerProfile.location_name
			: data.isClient && !data.isPerformer
				? 'Client Account'
				: 'Complete your profile'
	);
</script>

<svelte:head>
	<title>Dashboard - IgniteGigs</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Desktop Sidebar -->
	<aside class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
		<div class="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
			<!-- Logo -->
			<div class="flex items-center flex-shrink-0 px-4">
				<a href="/" class="flex items-center">
					<img src="/ignitegigs-logo-horizontal.png" alt="IgniteGigs" class="h-10 w-auto rounded-md" />
				</a>
			</div>

			<!-- User Info -->
			<div class="mt-6 px-4">
				<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
					<div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
						<span class="text-primary font-semibold">
							{displayName.charAt(0).toUpperCase()}
						</span>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900 truncate">
							{displayName}
						</p>
						<p class="text-xs text-gray-500 truncate">
							{displaySubtext}
						</p>
					</div>
				</div>
			</div>

			<!-- Navigation -->
			<nav class="mt-6 flex-1 px-2 space-y-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {isActiveRoute(
							item.href
						)
							? 'bg-primary/10 text-primary'
							: 'text-gray-700 hover:bg-gray-100'}"
					>
						<svg
							class="mr-3 h-5 w-5 flex-shrink-0 {isActiveRoute(item.href)
								? 'text-primary'
								: 'text-gray-400 group-hover:text-gray-500'}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIcon(item.icon)} />
						</svg>
						{item.label}
						{#if item.href === '/dashboard/my-bookings' && data.clientBookingsCount > 0}
							<span class="ml-auto bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
								{data.clientBookingsCount > 99 ? '99+' : data.clientBookingsCount}
							</span>
						{/if}
					</a>
				{/each}
			</nav>

			<!-- Profile Completion (performers only) -->
			{#if data.isPerformer && !data.performerProfile?.profile_complete}
				<div class="px-4 pb-4">
					<div class="p-4 bg-primary/5 rounded-lg border border-primary/20">
						<p class="text-sm font-medium text-primary">Complete your profile</p>
						<p class="text-xs text-gray-600 mt-1">Add videos and details to get discovered</p>
						<a
							href="/dashboard/profile"
							class="mt-3 inline-flex items-center text-xs font-medium text-primary hover:text-primary-hover"
						>
							Continue setup
							<svg class="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
							</svg>
						</a>
					</div>
				</div>
			{/if}

			<!-- Find Performers CTA (client-only users) -->
			{#if data.isClient && !data.isPerformer}
				<div class="px-4 pb-4">
					<div class="p-4 bg-primary/5 rounded-lg border border-primary/20">
						<p class="text-sm font-medium text-primary">Find performers</p>
						<p class="text-xs text-gray-600 mt-1">Browse talented acts for your next event</p>
						<a
							href="/performers"
							class="mt-3 inline-flex items-center text-xs font-medium text-primary hover:text-primary-hover"
						>
							Browse performers
							<svg class="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
							</svg>
						</a>
					</div>
				</div>
			{/if}
		</div>
	</aside>

	<!-- Mobile Header -->
	<div class="lg:hidden sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm">
		<a href="/" class="flex items-center">
			<img src="/ignitegigs-symbol.png" alt="IgniteGigs" class="h-8 w-auto rounded-md" />
		</a>
		<div class="flex-1"></div>
		<button
			type="button"
			class="text-gray-500"
			onclick={() => (mobileNavOpen = !mobileNavOpen)}
			aria-label="Toggle navigation"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>
	</div>

	<!-- Mobile Navigation Overlay -->
	{#if mobileNavOpen}
		<div class="lg:hidden fixed inset-0 z-50 flex">
			<!-- Backdrop -->
			<button
				class="fixed inset-0 bg-gray-600/75"
				onclick={() => (mobileNavOpen = false)}
				aria-label="Close navigation"
			></button>

			<!-- Sidebar -->
			<div class="relative flex w-full max-w-xs flex-1 flex-col bg-white animate-slide-up">
				<div class="absolute top-0 right-0 -mr-12 pt-2">
					<button
						type="button"
						class="ml-1 flex h-10 w-10 items-center justify-center rounded-full"
						onclick={() => (mobileNavOpen = false)}
					>
						<span class="sr-only">Close sidebar</span>
						<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
					<div class="flex items-center flex-shrink-0 px-4">
						<a href="/" class="flex items-center">
							<img src="/ignitegigs-logo-horizontal.png" alt="IgniteGigs" class="h-10 w-auto rounded-md" />
						</a>
					</div>
					<nav class="mt-5 px-2 space-y-1">
						{#each navItems as item}
							<a
								href={item.href}
								onclick={() => (mobileNavOpen = false)}
								class="group flex items-center px-3 py-2.5 text-base font-medium rounded-lg {isActiveRoute(item.href)
									? 'bg-primary/10 text-primary'
									: 'text-gray-700 hover:bg-gray-100'}"
							>
								<svg
									class="mr-4 h-6 w-6 flex-shrink-0 {isActiveRoute(item.href)
										? 'text-primary'
										: 'text-gray-400 group-hover:text-gray-500'}"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIcon(item.icon)} />
								</svg>
								{item.label}
								{#if item.href === '/dashboard/my-bookings' && data.clientBookingsCount > 0}
									<span class="ml-auto bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
										{data.clientBookingsCount > 99 ? '99+' : data.clientBookingsCount}
									</span>
								{/if}
							</a>
						{/each}
					</nav>
				</div>
			</div>
		</div>
	{/if}

	<!-- Mobile Bottom Navigation -->
	<nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
		<div class="grid grid-cols-5 gap-1 px-2 py-2">
			{#each navItems.slice(0, 5) as item}
				<a
					href={item.href}
					class="flex flex-col items-center py-2 px-1 rounded-lg {isActiveRoute(item.href)
						? 'text-primary'
						: 'text-gray-500 hover:text-gray-700'}"
				>
					<div class="relative">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIcon(item.icon)} />
						</svg>
						{#if item.href === '/dashboard/my-bookings' && data.clientBookingsCount > 0}
							<span class="absolute -top-1.5 -right-1.5 bg-primary text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
								{data.clientBookingsCount > 9 ? '9+' : data.clientBookingsCount}
							</span>
						{/if}
					</div>
					<span class="text-xs mt-1">{item.label}</span>
				</a>
			{/each}
		</div>
	</nav>

	<!-- Main Content -->
	<div class="lg:pl-64">
		<!-- Onboarding Banner -->
		{#if data.needsOnboarding && !onboardingBannerDismissed}
			<div class="bg-gradient-to-r from-warning to-primary px-4 py-3">
				<div class="flex items-center justify-between gap-4 max-w-7xl mx-auto">
					<div class="flex items-center gap-3 min-w-0">
						<svg class="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<p class="text-sm font-medium text-white truncate">
							Complete your profile to start getting bookings
						</p>
					</div>
					<div class="flex items-center gap-2 flex-shrink-0">
						<a
							href="/dashboard/onboarding"
							class="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-button bg-white text-primary hover:bg-gray-100 transition-colors"
						>
							Get started
						</a>
						<button
							type="button"
							onclick={() => (onboardingBannerDismissed = true)}
							class="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
							aria-label="Dismiss banner"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		{/if}

		<main class="py-6 px-4 sm:px-6 lg:px-8 pb-24 lg:pb-6">
			{@render children()}
		</main>
	</div>
</div>
