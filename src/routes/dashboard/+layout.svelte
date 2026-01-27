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
	}

	let { children, data }: { children: Snippet; data: DashboardData } = $props();

	const navItems = [
		{ href: '/dashboard', label: 'Overview', icon: 'home' },
		{ href: '/dashboard/profile', label: 'Profile', icon: 'user' },
		{ href: '/dashboard/bookings', label: 'Bookings', icon: 'calendar-check' },
		{ href: '/dashboard/calendar', label: 'Calendar', icon: 'calendar' },
		{ href: '/dashboard/media', label: 'Media', icon: 'video' },
		{ href: '/dashboard/messages', label: 'Messages', icon: 'message' },
		{ href: '/dashboard/settings', label: 'Settings', icon: 'settings' }
	];

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
			user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
			'calendar-check':
				'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
			calendar:
				'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
			video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
			message:
				'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
			settings:
				'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
		};
		return icons[icon] || icons.home;
	}
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
						{#if data.performerProfile?.stage_name}
							<span class="text-primary font-semibold">
								{data.performerProfile.stage_name.charAt(0).toUpperCase()}
							</span>
						{:else}
							<span class="text-primary font-semibold">
								{data.user?.full_name?.charAt(0).toUpperCase() || 'U'}
							</span>
						{/if}
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900 truncate">
							{data.performerProfile?.stage_name || data.user?.full_name || 'Performer'}
						</p>
						<p class="text-xs text-gray-500 truncate">
							{data.performerProfile?.location_name || 'Complete your profile'}
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
					</a>
				{/each}
			</nav>

			<!-- Profile Completion -->
			{#if !data.performerProfile?.profile_complete}
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
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getIcon(item.icon)} />
					</svg>
					<span class="text-xs mt-1">{item.label}</span>
				</a>
			{/each}
		</div>
	</nav>

	<!-- Main Content -->
	<div class="lg:pl-64">
		<main class="py-6 px-4 sm:px-6 lg:px-8 pb-24 lg:pb-6">
			{@render children()}
		</main>
	</div>
</div>
