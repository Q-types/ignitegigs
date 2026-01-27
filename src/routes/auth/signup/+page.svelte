<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let fullName = $state(form?.fullName ?? '');
	let email = $state(form?.email ?? '');
	let password = $state('');
	let confirmPassword = $state('');
	let accountType = $state<'performer' | 'client'>(data.accountType ?? 'performer');
	let isLoading = $state(false);
	let showPassword = $state(false);

	let passwordError = $derived(
		password && confirmPassword && password !== confirmPassword
			? 'Passwords do not match'
			: null
	);

	let passwordStrength = $derived.by(() => {
		if (!password) return { score: 0, label: '', color: '' };
		let score = 0;
		if (password.length >= 8) score++;
		if (password.length >= 12) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;

		if (score <= 2) return { score, label: 'Weak', color: 'bg-error' };
		if (score <= 3) return { score, label: 'Fair', color: 'bg-warning' };
		if (score <= 4) return { score, label: 'Good', color: 'bg-success' };
		return { score: 5, label: 'Strong', color: 'bg-success' };
	});

	let isFormValid = $derived(
		fullName.length >= 2 &&
		email.includes('@') &&
		password.length >= 8 &&
		password === confirmPassword
	);

	let successMessage = $derived(form?.success ? form?.message : null);
	let errorMessage = $derived(form?.error ?? null);
</script>

<svelte:head>
	<title>Sign Up - IgniteGigs</title>
	<meta name="description" content="Join IgniteGigs as a fire or LED performer or book incredible entertainment for your event." />
</svelte:head>

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
	<div class="w-full max-w-md">
		<!-- Header -->
		<div class="text-center mb-8">
			<a href="/" class="inline-block mb-6">
				<img src="/ignitegigs-logo-horizontal.png" alt="IgniteGigs" class="h-12 w-auto rounded-md mx-auto" />
			</a>
			<h1 class="font-display text-3xl font-bold text-secondary mb-2">
				Create your account
			</h1>
			<p class="text-gray-600">
				{#if accountType === 'performer'}
					Start showcasing your fire & LED performances
				{:else}
					Find and book amazing performers
				{/if}
			</p>
		</div>

		<!-- Card -->
		<div class="bg-white rounded-card shadow-card p-8">
			<!-- Success Message -->
			{#if successMessage}
				<div class="mb-6 p-4 bg-success-light text-success rounded-lg flex items-start gap-3">
					<svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<div>
						<span class="font-medium">{successMessage}</span>
						{#if form?.requiresConfirmation}
							<p class="text-sm mt-1 opacity-90">Check your inbox and click the link to activate your account.</p>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Error Message -->
			{#if errorMessage}
				<div class="mb-6 p-4 bg-error-light text-error rounded-lg flex items-start gap-3">
					<svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span>{errorMessage}</span>
				</div>
			{/if}

			<!-- Account Type Toggle -->
			<div class="mb-6">
				<label class="label mb-2">I want to</label>
				<div class="grid grid-cols-2 gap-3">
					<button
						type="button"
						class="p-4 rounded-lg border-2 transition-all text-left {accountType === 'performer'
							? 'border-primary bg-primary/5'
							: 'border-gray-200 hover:border-gray-300'}"
						onclick={() => (accountType = 'performer')}
					>
						<span class="w-8 h-8 mb-2 block">
							<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
							</svg>
						</span>
						<span class="font-semibold text-gray-900 block">Perform</span>
						<span class="text-sm text-gray-500">Showcase my skills</span>
					</button>
					<button
						type="button"
						class="p-4 rounded-lg border-2 transition-all text-left {accountType === 'client'
							? 'border-primary bg-primary/5'
							: 'border-gray-200 hover:border-gray-300'}"
						onclick={() => (accountType = 'client')}
					>
						<span class="w-8 h-8 mb-2 block">
							<svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
							</svg>
						</span>
						<span class="font-semibold text-gray-900 block">Book</span>
						<span class="text-sm text-gray-500">Hire performers</span>
					</button>
				</div>
			</div>

			<!-- Google OAuth -->
			<form method="POST" action="?/google&type={accountType}&redirectTo={data.redirectTo}" use:enhance={() => {
				isLoading = true;
				return async ({ update }) => {
					isLoading = false;
					await update();
				};
			}}>
				<button
					type="submit"
					disabled={isLoading}
					class="w-full h-12 flex items-center justify-center gap-3 border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
				>
					<svg class="w-5 h-5" viewBox="0 0 24 24">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					</svg>
					Continue with Google
				</button>
			</form>

			<!-- Divider -->
			<div class="relative my-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-200"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-4 bg-white text-gray-500">or sign up with email</span>
				</div>
			</div>

			<!-- Signup Form -->
			<form
				method="POST"
				action="?/signup"
				use:enhance={() => {
					isLoading = true;
					return async ({ update }) => {
						isLoading = false;
						await update();
					};
				}}
			>
				<input type="hidden" name="redirectTo" value={data.redirectTo} />
				<input type="hidden" name="accountType" value={accountType} />

				<div class="space-y-4">
					<!-- Full Name -->
					<div>
						<label for="fullName" class="label">Full name</label>
						<input
							id="fullName"
							name="fullName"
							type="text"
							autocomplete="name"
							required
							bind:value={fullName}
							class="input"
							placeholder="Your full name"
						/>
					</div>

					<!-- Email -->
					<div>
						<label for="email" class="label">Email address</label>
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							bind:value={email}
							class="input"
							placeholder="you@example.com"
						/>
					</div>

					<!-- Password -->
					<div>
						<label for="password" class="label">Password</label>
						<div class="relative">
							<input
								id="password"
								name="password"
								type={showPassword ? 'text' : 'password'}
								autocomplete="new-password"
								required
								minlength="8"
								bind:value={password}
								class="input pr-10"
								placeholder="At least 8 characters"
							/>
							<button
								type="button"
								class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
								onclick={() => (showPassword = !showPassword)}
							>
								{#if showPassword}
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
									</svg>
								{:else}
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
								{/if}
							</button>
						</div>
						<!-- Password strength indicator -->
						{#if password}
							<div class="mt-2">
								<div class="flex gap-1 mb-1">
									{#each Array(5) as _, i}
										<div
											class="h-1 flex-1 rounded-full {i < passwordStrength.score
												? passwordStrength.color
												: 'bg-gray-200'}"
										></div>
									{/each}
								</div>
								<span class="text-xs text-gray-500">{passwordStrength.label}</span>
							</div>
						{/if}
					</div>

					<!-- Confirm Password -->
					<div>
						<label for="confirmPassword" class="label">Confirm password</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={showPassword ? 'text' : 'password'}
							autocomplete="new-password"
							required
							bind:value={confirmPassword}
							class="input"
							class:border-error={passwordError}
							placeholder="Confirm your password"
						/>
						{#if passwordError}
							<p class="text-sm text-error mt-1">{passwordError}</p>
						{/if}
					</div>

					<!-- Terms -->
					<p class="text-xs text-gray-500">
						By signing up, you agree to our
						<a href="/terms" class="text-primary hover:underline">Terms of Service</a>
						and
						<a href="/privacy" class="text-primary hover:underline">Privacy Policy</a>.
					</p>

					<!-- Submit -->
					<button
						type="submit"
						disabled={isLoading || !isFormValid}
						class="btn-primary btn-lg w-full"
					>
						{#if isLoading}
							<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Creating account...
						{:else}
							Create account
						{/if}
					</button>
				</div>
			</form>
		</div>

		<!-- Login link -->
		<p class="text-center mt-6 text-gray-600">
			Already have an account?
			<a href="/auth/login" class="text-primary font-semibold hover:text-primary-hover">
				Log in
			</a>
		</p>
	</div>
</div>
