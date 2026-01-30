<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';

	interface AdminLayoutData {
		adminUser: { email?: string };
		platformStats: {
			totalUsers: number;
			totalPerformers: number;
			totalBookings: number;
			pendingVerifications: number;
			openDisputes: number;
		};
	}

	let { children, data }: { children: Snippet; data: AdminLayoutData } = $props();

	const navItems = $derived([
		{
			href: '/admin',
			label: 'Dashboard',
			icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
			badge: null
		},
		{
			href: '/admin/users',
			label: 'Users',
			icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
			badge: null
		},
		{
			href: '/admin/bookings',
			label: 'Bookings',
			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
			badge: null
		},
		{
			href: '/admin/performers',
			label: 'Performers',
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
			badge: data.platformStats.pendingVerifications > 0 ? data.platformStats.pendingVerifications : null
		},
		{
			href: '/admin/disputes',
			label: 'Disputes',
			icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z',
			badge: data.platformStats.openDisputes > 0 ? data.platformStats.openDisputes : null
		},
		{
			href: '/admin/blog',
			label: 'Blog Moderation',
			icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
			badge: null
		},
		{
			href: '/admin/settings',
			label: 'Settings',
			icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
			badge: null
		}
	]);

	let mobileNavOpen = $state(false);

	function isActiveRoute(href: string): boolean {
		if (href === '/admin') {
			return $page.url.pathname === '/admin';
		}
		return $page.url.pathname.startsWith(href);
	}
</script>

<svelte:head>
	<title>Admin Panel - IgniteGigs</title>
</svelte:head>

<div class="min-h-screen bg-gray-100">
	<!-- Desktop Sidebar -->
	<aside class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-50">
		<div class="flex flex-col flex-grow overflow-y-auto" style="background-color: #1E1E2E;">
			<!-- Admin Header -->
			<div class="flex items-center flex-shrink-0 px-5 py-5 border-b border-white/10">
				<a href="/admin" class="flex items-center gap-3">
					<div class="w-9 h-9 rounded-lg flex items-center justify-center" style="background-color: #FF6B35;">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>
					<div>
						<p class="text-white font-bold text-sm">IgniteGigs</p>
						<p class="text-xs" style="color: #FF6B35;">Admin Panel</p>
					</div>
				</a>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 px-3 py-4 space-y-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {isActiveRoute(item.href)
							? 'text-white'
							: 'text-gray-400 hover:text-white hover:bg-white/5'}"
						style={isActiveRoute(item.href) ? 'background-color: #FF6B35;' : ''}
					>
						<svg
							class="mr-3 h-5 w-5 flex-shrink-0 {isActiveRoute(item.href) ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
						</svg>
						<span class="flex-1">{item.label}</span>
						{#if item.badge}
							<span class="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
								{item.badge}
							</span>
						{/if}
					</a>
				{/each}
			</nav>

			<!-- Admin User Footer -->
			<div class="flex-shrink-0 border-t border-white/10 p-4">
				<div class="flex items-center gap-3">
					<div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
						<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-xs text-gray-400 truncate">{data.adminUser?.email ?? 'Admin'}</p>
					</div>
					<a href="/dashboard" class="text-gray-500 hover:text-gray-300 transition-colors" title="Back to Dashboard">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
					</a>
				</div>
			</div>
		</div>
	</aside>

	<!-- Mobile Header -->
	<div class="lg:hidden sticky top-0 z-40 flex items-center gap-x-4 px-4 py-3 shadow-sm" style="background-color: #1E1E2E;">
		<button
			type="button"
			class="text-gray-400 hover:text-white"
			onclick={() => (mobileNavOpen = !mobileNavOpen)}
			aria-label="Toggle navigation"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>
		<div class="flex items-center gap-2">
			<div class="w-7 h-7 rounded-md flex items-center justify-center" style="background-color: #FF6B35;">
				<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
			</div>
			<span class="text-white font-bold text-sm">Admin Panel</span>
		</div>
	</div>

	<!-- Mobile Navigation Overlay -->
	{#if mobileNavOpen}
		<div class="lg:hidden fixed inset-0 z-50 flex">
			<button
				class="fixed inset-0 bg-black/60"
				onclick={() => (mobileNavOpen = false)}
				aria-label="Close navigation"
			></button>
			<div class="relative flex w-full max-w-xs flex-1 flex-col" style="background-color: #1E1E2E;">
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
					<div class="flex items-center flex-shrink-0 px-5 mb-6">
						<div class="flex items-center gap-3">
							<div class="w-9 h-9 rounded-lg flex items-center justify-center" style="background-color: #FF6B35;">
								<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<div>
								<p class="text-white font-bold text-sm">IgniteGigs</p>
								<p class="text-xs" style="color: #FF6B35;">Admin Panel</p>
							</div>
						</div>
					</div>
					<nav class="px-3 space-y-1">
						{#each navItems as item}
							<a
								href={item.href}
								onclick={() => (mobileNavOpen = false)}
								class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors {isActiveRoute(item.href)
									? 'text-white'
									: 'text-gray-400 hover:text-white hover:bg-white/5'}"
								style={isActiveRoute(item.href) ? 'background-color: #FF6B35;' : ''}
							>
								<svg
									class="mr-3 h-5 w-5 flex-shrink-0 {isActiveRoute(item.href) ? 'text-white' : 'text-gray-500'}"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
								</svg>
								<span class="flex-1">{item.label}</span>
								{#if item.badge}
									<span class="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
										{item.badge}
									</span>
								{/if}
							</a>
						{/each}
					</nav>
				</div>
			</div>
		</div>
	{/if}

	<!-- Main Content -->
	<div class="lg:pl-64">
		<main class="py-6 px-4 sm:px-6 lg:px-8">
			{@render children()}
		</main>
	</div>
</div>
