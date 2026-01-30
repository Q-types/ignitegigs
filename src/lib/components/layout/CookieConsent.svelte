<script lang="ts">
	import { browser } from '$app/environment';

	const STORAGE_KEY = 'cookie-consent';

	interface CookiePreferences {
		essential: boolean;
		analytics: boolean;
		marketing: boolean;
		consentedAt: string;
	}

	let visible = $state(false);
	let showPreferences = $state(false);
	let analyticsEnabled = $state(false);
	let marketingEnabled = $state(false);

	// Check localStorage on mount
	$effect(() => {
		if (browser) {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (!stored) {
				// Small delay for smooth entrance animation
				setTimeout(() => {
					visible = true;
				}, 500);
			}
		}
	});

	function savePreferences(preferences: CookiePreferences) {
		if (browser) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
		}
		visible = false;
		showPreferences = false;
	}

	function acceptAll() {
		savePreferences({
			essential: true,
			analytics: true,
			marketing: true,
			consentedAt: new Date().toISOString()
		});
	}

	function essentialOnly() {
		savePreferences({
			essential: true,
			analytics: false,
			marketing: false,
			consentedAt: new Date().toISOString()
		});
	}

	function saveCustomPreferences() {
		savePreferences({
			essential: true,
			analytics: analyticsEnabled,
			marketing: marketingEnabled,
			consentedAt: new Date().toISOString()
		});
	}

	function togglePreferences() {
		showPreferences = !showPreferences;
	}
</script>

{#if visible}
	<div
		class="fixed bottom-0 left-0 right-0 z-[9999] mb-16 sm:mb-0 transition-transform duration-500 ease-out"
		class:translate-y-0={visible}
		class:translate-y-full={!visible}
		role="dialog"
		aria-label="Cookie consent"
	>
		<div class="bg-secondary/[0.97] backdrop-blur-sm border-t border-white/10 shadow-2xl">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
				{#if !showPreferences}
					<!-- Main Banner -->
					<div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2.5 mb-1.5">
								<svg class="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
								<h3 class="text-sm font-semibold text-white">Cookie Preferences</h3>
							</div>
							<p class="text-sm text-gray-300 leading-relaxed">
								We use essential cookies to make IgniteGigs work. We also use optional cookies for analytics.
								Read our <a href="/privacy" class="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">privacy policy</a> for more details.
							</p>
						</div>
						<div class="flex flex-wrap items-center gap-2.5 flex-shrink-0 w-full sm:w-auto">
							<button
								type="button"
								onclick={togglePreferences}
								class="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-gray-300 border border-white/20 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
							>
								Manage Preferences
							</button>
							<button
								type="button"
								onclick={essentialOnly}
								class="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
							>
								Essential Only
							</button>
							<button
								type="button"
								onclick={acceptAll}
								class="flex-1 sm:flex-none px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
							>
								Accept All
							</button>
						</div>
					</div>
				{:else}
					<!-- Preferences Panel -->
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2.5">
								<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								<h3 class="text-sm font-semibold text-white">Manage Cookie Preferences</h3>
							</div>
							<button
								type="button"
								onclick={togglePreferences}
								class="text-gray-400 hover:text-white transition-colors"
								aria-label="Close preferences"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<div class="space-y-3">
							<!-- Essential Cookies (always on) -->
							<label class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
								<div class="flex-1 min-w-0 pr-4">
									<div class="flex items-center gap-2">
										<p class="text-sm font-medium text-white">Essential Cookies</p>
										<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">
											Always On
										</span>
									</div>
									<p class="text-xs text-gray-400 mt-0.5">
										Required for the site to function. These cannot be disabled.
									</p>
								</div>
								<div class="relative flex-shrink-0">
									<input type="checkbox" checked disabled class="sr-only peer" />
									<div class="w-11 h-6 bg-primary rounded-full cursor-not-allowed opacity-75"></div>
									<div class="absolute left-[22px] top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"></div>
								</div>
							</label>

							<!-- Analytics Cookies -->
							<label class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/[0.08] transition-colors">
								<div class="flex-1 min-w-0 pr-4">
									<p class="text-sm font-medium text-white">Analytics Cookies</p>
									<p class="text-xs text-gray-400 mt-0.5">
										Help us understand how visitors interact with our website.
									</p>
								</div>
								<div class="relative flex-shrink-0">
									<input type="checkbox" bind:checked={analyticsEnabled} class="sr-only peer" />
									<div class="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-primary transition-colors peer-focus:ring-2 peer-focus:ring-primary/30"></div>
									<div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
								</div>
							</label>

							<!-- Marketing Cookies -->
							<label class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/[0.08] transition-colors">
								<div class="flex-1 min-w-0 pr-4">
									<p class="text-sm font-medium text-white">Marketing Cookies</p>
									<p class="text-xs text-gray-400 mt-0.5">
										Used to deliver personalised advertisements and measure ad campaigns.
									</p>
								</div>
								<div class="relative flex-shrink-0">
									<input type="checkbox" bind:checked={marketingEnabled} class="sr-only peer" />
									<div class="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-primary transition-colors peer-focus:ring-2 peer-focus:ring-primary/30"></div>
									<div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
								</div>
							</label>
						</div>

						<div class="flex items-center justify-between pt-1">
							<a href="/privacy" class="text-xs text-gray-400 hover:text-primary underline underline-offset-2 transition-colors">
								Privacy Policy
							</a>
							<div class="flex items-center gap-2.5">
								<button
									type="button"
									onclick={essentialOnly}
									class="px-4 py-2.5 text-sm font-medium text-gray-300 border border-white/20 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
								>
									Essential Only
								</button>
								<button
									type="button"
									onclick={saveCustomPreferences}
									class="px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
								>
									Save Preferences
								</button>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
