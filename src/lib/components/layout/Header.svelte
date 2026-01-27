<script lang="ts">
	import type { User } from '@supabase/supabase-js';

	let { user }: { user: User | null } = $props();

	let mobileMenuOpen = $state(false);
</script>

<header class="bg-white border-b border-gray-100 sticky top-0 z-50">
	<nav class="container-wide">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2">
				<img src="/logo.png" alt="IgniteGigs" class="h-10 w-auto" />
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center gap-6">
				<a href="/performers" class="text-gray-600 hover:text-secondary transition-colors">
					Find Performers
				</a>
				<a href="/how-it-works" class="text-gray-600 hover:text-secondary transition-colors">
					How It Works
				</a>

				{#if user}
					<a href="/dashboard" class="text-gray-600 hover:text-secondary transition-colors">
						Dashboard
					</a>
					<form method="POST" action="/auth/logout">
						<button type="submit" class="btn-ghost btn-md">
							Log Out
						</button>
					</form>
				{:else}
					<a href="/auth/login" class="btn-ghost btn-md">
						Log In
					</a>
					<a href="/auth/signup?type=performer" class="btn-primary btn-md">
						Join as Performer
					</a>
				{/if}
			</div>

			<!-- Mobile Menu Button -->
			<button
				type="button"
				class="md:hidden p-2 text-gray-600"
				onclick={() => mobileMenuOpen = !mobileMenuOpen}
				aria-label="Toggle menu"
			>
				{#if mobileMenuOpen}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				{/if}
			</button>
		</div>

		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden border-t border-gray-100 py-4 animate-fade-in">
				<div class="flex flex-col gap-2">
					<a href="/performers" class="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
						Find Performers
					</a>
					<a href="/how-it-works" class="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
						How It Works
					</a>

					{#if user}
						<a href="/dashboard" class="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
							Dashboard
						</a>
						<form method="POST" action="/auth/logout" class="px-4">
							<button type="submit" class="w-full btn-ghost btn-md justify-start">
								Log Out
							</button>
						</form>
					{:else}
						<a href="/auth/login" class="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
							Log In
						</a>
						<div class="px-4 pt-2">
							<a href="/auth/signup?type=performer" class="btn-primary btn-md w-full">
								Join as Performer
							</a>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</nav>
</header>
