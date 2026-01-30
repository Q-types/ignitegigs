<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import type { User, PerformerProfile } from '$lib/types/database';
	import type { User as AuthUser } from '@supabase/supabase-js';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let activeTab = $state<'account' | 'security' | 'notifications' | 'privacy'>('account');

	// Account form state
	let fullName = $state(data.user?.full_name ?? '');
	let phone = $state(data.user?.phone ?? '');
	let isAccountLoading = $state(false);

	// Password form state
	let newPassword = $state('');
	let confirmPassword = $state('');
	let isPasswordLoading = $state(false);

	// Notification preferences (UI-only for now)
	let notifyBookings = $state(true);
	let notifyMessages = $state(true);
	let notifySms = $state(false);
	let notifyMarketing = $state(false);

	// Delete account state
	let showDeleteConfirm = $state(false);
	let deleteConfirmText = $state('');
	let isDeletingAccount = $state(false);

	// Privacy & Data state
	let isExportingData = $state(false);
	let exportStatus = $state<{ type: 'success' | 'error'; message: string } | null>(null);
	let showGdprDeleteModal = $state(false);
	let gdprDeleteConfirmText = $state('');
	let isGdprDeleting = $state(false);
	let gdprDeleteStatus = $state<{ type: 'success' | 'error'; message: string } | null>(null);
	let canGdprDelete = $derived(gdprDeleteConfirmText === 'DELETE MY ACCOUNT');

	async function exportUserData() {
		isExportingData = true;
		exportStatus = null;

		try {
			const response = await fetch('/api/user/export');
			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.error || 'Failed to export data');
			}

			// Trigger file download
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `ignitegigs-data-export-${new Date().toISOString().split('T')[0]}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			exportStatus = { type: 'success', message: 'Your data has been exported successfully.' };
		} catch (err) {
			exportStatus = {
				type: 'error',
				message: err instanceof Error ? err.message : 'Failed to export data. Please try again.'
			};
		} finally {
			isExportingData = false;
		}
	}

	async function deleteAccountGdpr() {
		if (!canGdprDelete) return;

		isGdprDeleting = true;
		gdprDeleteStatus = null;

		try {
			const response = await fetch('/api/user/delete', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ confirm: true })
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to delete account');
			}

			// Redirect to homepage after deletion
			window.location.href = '/?deleted=true';
		} catch (err) {
			gdprDeleteStatus = {
				type: 'error',
				message: err instanceof Error ? err.message : 'Failed to delete account. Please contact support.'
			};
			isGdprDeleting = false;
		}
	}

	// Derived helpers
	let passwordsMatch = $derived(newPassword === confirmPassword);
	let passwordValid = $derived(newPassword.length >= 8);
	let canSubmitPassword = $derived(passwordValid && passwordsMatch && newPassword.length > 0);
	let canDeleteAccount = $derived(deleteConfirmText === 'DELETE');

	function formatDate(dateStr: string | undefined): string {
		if (!dateStr) return 'Unknown';
		return new Date(dateStr).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	const tabs = [
		{
			id: 'account' as const,
			label: 'Account',
			icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
		},
		{
			id: 'security' as const,
			label: 'Security',
			icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
		},
		{
			id: 'notifications' as const,
			label: 'Notifications',
			icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
		},
		{
			id: 'privacy' as const,
			label: 'Privacy & Data',
			icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
		}
	];
</script>

<svelte:head>
	<title>Settings - IgniteGigs</title>
</svelte:head>

<div class="space-y-6 max-w-3xl">
	<!-- Header -->
	<div>
		<h1 class="font-display text-2xl lg:text-3xl font-bold text-secondary">Settings</h1>
		<p class="text-gray-600 mt-1">Manage your account settings and preferences.</p>
	</div>

	<!-- Tab Navigation -->
	<div class="bg-white rounded-card shadow-card">
		<div class="border-b border-gray-200">
			<nav class="flex -mb-px" aria-label="Settings tabs">
				{#each tabs as tab}
					<button
						type="button"
						onclick={() => (activeTab = tab.id)}
						class="flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap {activeTab === tab.id
							? 'border-primary text-primary'
							: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
						aria-current={activeTab === tab.id ? 'page' : undefined}
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d={tab.icon}
							/>
						</svg>
						{tab.label}
					</button>
				{/each}
			</nav>
		</div>
	</div>

	<!-- Account Tab -->
	{#if activeTab === 'account'}
		<div class="space-y-6 animate-fade-in">
			<!-- Account Info Success/Error -->
			{#if form?.section === 'account' && form?.success}
				<div class="p-4 bg-success/10 text-success rounded-lg flex items-center gap-3">
					<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					{form.message}
				</div>
			{/if}
			{#if form?.section === 'account' && form?.error}
				<div class="p-4 bg-error/10 text-error rounded-lg flex items-center gap-3">
					<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					{form.error}
				</div>
			{/if}

			<!-- Account Information -->
			<form
				method="POST"
				action="?/updateAccount"
				use:enhance={() => {
					isAccountLoading = true;
					return async ({ update }) => {
						isAccountLoading = false;
						await update();
					};
				}}
			>
				<div class="bg-white rounded-card shadow-card p-6">
					<h2 class="font-display text-lg font-semibold text-secondary mb-1">
						Account Information
					</h2>
					<p class="text-sm text-gray-500 mb-6">
						Update your personal details. Your email is managed through authentication.
					</p>

					<div class="space-y-5">
						<div>
							<label for="fullName" class="label">Full Name</label>
							<input
								id="fullName"
								name="fullName"
								type="text"
								bind:value={fullName}
								required
								class="input"
								placeholder="Your full name"
							/>
						</div>

						<div>
							<label for="email" class="label">Email Address</label>
							<input
								id="email"
								type="email"
								value={data.user?.email ?? data.authUser?.email ?? ''}
								disabled
								class="input bg-gray-50"
							/>
							<p class="text-xs text-gray-400 mt-1.5">
								Contact support to change your email address.
							</p>
						</div>

						<div>
							<label for="phone" class="label">Phone Number</label>
							<input
								id="phone"
								name="phone"
								type="tel"
								bind:value={phone}
								class="input"
								placeholder="+44 7700 900000"
							/>
							<p class="text-xs text-gray-400 mt-1.5">
								Used for booking notifications and client contact.
							</p>
						</div>

						<!-- Account metadata -->
						<div class="pt-4 border-t border-gray-100">
							<div class="grid sm:grid-cols-2 gap-4 text-sm">
								<div>
									<span class="text-gray-500">Account type</span>
									<p class="font-medium text-gray-900 capitalize">
										{data.user?.user_type ?? 'Unknown'}
									</p>
								</div>
								<div>
									<span class="text-gray-500">Member since</span>
									<p class="font-medium text-gray-900">
										{formatDate(data.user?.created_at)}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div class="flex justify-end mt-6 pt-4 border-t border-gray-100">
						<button type="submit" disabled={isAccountLoading} class="btn-primary btn-md">
							{#if isAccountLoading}
								<svg
									class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
									></path>
								</svg>
								Saving...
							{:else}
								Save Changes
							{/if}
						</button>
					</div>
				</div>
			</form>
		</div>
	{/if}

	<!-- Security Tab -->
	{#if activeTab === 'security'}
		<div class="space-y-6 animate-fade-in">
			<!-- Password Success/Error -->
			{#if form?.section === 'password' && form?.success}
				<div class="p-4 bg-success/10 text-success rounded-lg flex items-center gap-3">
					<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					{form.message}
				</div>
			{/if}
			{#if form?.section === 'password' && form?.error}
				<div class="p-4 bg-error/10 text-error rounded-lg flex items-center gap-3">
					<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					{form.error}
				</div>
			{/if}

			<!-- Change Password -->
			<form
				method="POST"
				action="?/updatePassword"
				use:enhance={() => {
					isPasswordLoading = true;
					return async ({ update }) => {
						isPasswordLoading = false;
						newPassword = '';
						confirmPassword = '';
						await update();
					};
				}}
			>
				<div class="bg-white rounded-card shadow-card p-6">
					<h2 class="font-display text-lg font-semibold text-secondary mb-1">
						Change Password
					</h2>
					<p class="text-sm text-gray-500 mb-6">
						Update your password to keep your account secure.
					</p>

					<div class="space-y-5">
						<div>
							<label for="newPassword" class="label">New Password</label>
							<input
								id="newPassword"
								name="newPassword"
								type="password"
								bind:value={newPassword}
								required
								minlength="8"
								class="input {newPassword.length > 0 && !passwordValid ? 'input-error' : ''}"
								placeholder="Minimum 8 characters"
							/>
							{#if newPassword.length > 0 && !passwordValid}
								<p class="text-xs text-error mt-1.5">
									Password must be at least 8 characters.
								</p>
							{/if}
						</div>

						<div>
							<label for="confirmPassword" class="label">Confirm New Password</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								bind:value={confirmPassword}
								required
								class="input {confirmPassword.length > 0 && !passwordsMatch ? 'input-error' : ''}"
								placeholder="Re-enter your new password"
							/>
							{#if confirmPassword.length > 0 && !passwordsMatch}
								<p class="text-xs text-error mt-1.5">Passwords do not match.</p>
							{/if}
						</div>

						<!-- Password strength indicators -->
						{#if newPassword.length > 0}
							<div class="space-y-2">
								<p class="text-xs font-medium text-gray-500">Password requirements:</p>
								<div class="flex items-center gap-2 text-xs">
									<svg
										class="w-4 h-4 {passwordValid ? 'text-success' : 'text-gray-300'}"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<span class={passwordValid ? 'text-success' : 'text-gray-400'}>
										At least 8 characters
									</span>
								</div>
								<div class="flex items-center gap-2 text-xs">
									<svg
										class="w-4 h-4 {passwordsMatch && confirmPassword.length > 0 ? 'text-success' : 'text-gray-300'}"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
									<span
										class={passwordsMatch && confirmPassword.length > 0
											? 'text-success'
											: 'text-gray-400'}
									>
										Passwords match
									</span>
								</div>
							</div>
						{/if}
					</div>

					<div class="flex justify-end mt-6 pt-4 border-t border-gray-100">
						<button
							type="submit"
							disabled={!canSubmitPassword || isPasswordLoading}
							class="btn-primary btn-md"
						>
							{#if isPasswordLoading}
								<svg
									class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
									></path>
								</svg>
								Updating...
							{:else}
								Update Password
							{/if}
						</button>
					</div>
				</div>
			</form>

			<!-- Active Sessions -->
			<div class="bg-white rounded-card shadow-card p-6">
				<h2 class="font-display text-lg font-semibold text-secondary mb-1">Active Sessions</h2>
				<p class="text-sm text-gray-500 mb-6">
					Manage your active login sessions across devices.
				</p>

				<div class="space-y-4">
					<!-- Current session -->
					<div
						class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
					>
						<div class="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
							<svg
								class="w-5 h-5 text-success"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2">
								<p class="text-sm font-medium text-gray-900">Current Session</p>
								<span
									class="inline-flex items-center px-2 py-0.5 rounded-badge text-xs font-medium bg-success/10 text-success"
								>
									Active
								</span>
							</div>
							<p class="text-xs text-gray-500 mt-0.5">
								{data.authUser?.email ?? 'Unknown'} &middot; Last active now
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Two-Factor Authentication -->
			<div class="bg-white rounded-card shadow-card p-6">
				<div class="flex items-center justify-between mb-1">
					<h2 class="font-display text-lg font-semibold text-secondary">
						Two-Factor Authentication
					</h2>
					<span
						class="inline-flex items-center px-2.5 py-1 rounded-badge text-xs font-medium bg-gray-100 text-gray-500"
					>
						Coming Soon
					</span>
				</div>
				<p class="text-sm text-gray-500 mb-4">
					Add an extra layer of security to your account by enabling two-factor authentication.
				</p>

				<div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
					<div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
						<svg
							class="w-5 h-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-gray-900">Authenticator App</p>
						<p class="text-xs text-gray-500 mt-0.5">
							Use an authenticator app to generate one-time codes.
						</p>
					</div>
					<button type="button" disabled class="btn btn-md border border-gray-200 text-gray-400 cursor-not-allowed">
						Enable
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Notifications Tab -->
	{#if activeTab === 'notifications'}
		<div class="space-y-6 animate-fade-in">
			<div class="bg-white rounded-card shadow-card p-6">
				<h2 class="font-display text-lg font-semibold text-secondary mb-1">
					Email Notifications
				</h2>
				<p class="text-sm text-gray-500 mb-6">
					Choose which email notifications you would like to receive.
				</p>

				<div class="space-y-1">
					<!-- Booking notifications -->
					<label
						class="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
					>
						<div class="flex-1 min-w-0 pr-4">
							<p class="text-sm font-medium text-gray-900">New booking requests</p>
							<p class="text-xs text-gray-500 mt-0.5">
								Get notified when you receive a new booking inquiry or confirmation.
							</p>
						</div>
						<div class="relative flex-shrink-0">
							<input type="checkbox" bind:checked={notifyBookings} class="sr-only peer" />
							<div
								class="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors peer-focus:ring-2 peer-focus:ring-primary/20"
							></div>
							<div
								class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"
							></div>
						</div>
					</label>

					<div class="border-t border-gray-100"></div>

					<!-- Message notifications -->
					<label
						class="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
					>
						<div class="flex-1 min-w-0 pr-4">
							<p class="text-sm font-medium text-gray-900">Messages</p>
							<p class="text-xs text-gray-500 mt-0.5">
								Get notified when a client or performer sends you a message.
							</p>
						</div>
						<div class="relative flex-shrink-0">
							<input type="checkbox" bind:checked={notifyMessages} class="sr-only peer" />
							<div
								class="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors peer-focus:ring-2 peer-focus:ring-primary/20"
							></div>
							<div
								class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"
							></div>
						</div>
					</label>

					<div class="border-t border-gray-100"></div>

					<!-- SMS notifications -->
					<label
						class="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer opacity-60"
					>
						<div class="flex-1 min-w-0 pr-4">
							<div class="flex items-center gap-2">
								<p class="text-sm font-medium text-gray-900">SMS notifications</p>
								<span
									class="inline-flex items-center px-2 py-0.5 rounded-badge text-xs font-medium bg-gray-100 text-gray-500"
								>
									Coming Soon
								</span>
							</div>
							<p class="text-xs text-gray-500 mt-0.5">
								Receive text message alerts for urgent booking updates.
							</p>
						</div>
						<div class="relative flex-shrink-0">
							<input
								type="checkbox"
								bind:checked={notifySms}
								disabled
								class="sr-only peer"
							/>
							<div
								class="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors cursor-not-allowed"
							></div>
							<div
								class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"
							></div>
						</div>
					</label>

					<div class="border-t border-gray-100"></div>

					<!-- Marketing emails -->
					<label
						class="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
					>
						<div class="flex-1 min-w-0 pr-4">
							<p class="text-sm font-medium text-gray-900">Marketing emails</p>
							<p class="text-xs text-gray-500 mt-0.5">
								Receive tips, product updates, and promotional content from IgniteGigs.
							</p>
						</div>
						<div class="relative flex-shrink-0">
							<input type="checkbox" bind:checked={notifyMarketing} class="sr-only peer" />
							<div
								class="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors peer-focus:ring-2 peer-focus:ring-primary/20"
							></div>
							<div
								class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"
							></div>
						</div>
					</label>
				</div>

				<div class="mt-6 pt-4 border-t border-gray-100">
					<p class="text-xs text-gray-400">
						Notification preferences are saved automatically. Backend integration coming
						soon.
					</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- Privacy & Data Tab -->
	{#if activeTab === 'privacy'}
		<div class="space-y-6 animate-fade-in">
			<!-- Export Data -->
			<div class="bg-white rounded-card shadow-card p-6">
				<div class="flex items-center gap-3 mb-1">
					<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					<h2 class="font-display text-lg font-semibold text-secondary">Export My Data</h2>
				</div>
				<p class="text-sm text-gray-500 mb-6">
					Download a copy of all your personal data stored on IgniteGigs. This includes your
					profile information, bookings, messages, and reviews. The data will be provided as a
					JSON file per your GDPR rights.
				</p>

				{#if exportStatus}
					<div class="p-4 mb-4 rounded-lg flex items-center gap-3 {exportStatus.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}">
						<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							{#if exportStatus.type === 'success'}
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							{:else}
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							{/if}
						</svg>
						{exportStatus.message}
					</div>
				{/if}

				<button
					type="button"
					onclick={exportUserData}
					disabled={isExportingData}
					class="btn-primary btn-md"
				>
					{#if isExportingData}
						<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
						</svg>
						Preparing Export...
					{:else}
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
						</svg>
						Export My Data
					{/if}
				</button>
			</div>

			<!-- Cookie Preferences -->
			<div class="bg-white rounded-card shadow-card p-6">
				<div class="flex items-center gap-3 mb-1">
					<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
					<h2 class="font-display text-lg font-semibold text-secondary">Cookie Preferences</h2>
				</div>
				<p class="text-sm text-gray-500 mb-6">
					Manage your cookie preferences at any time. You can change which optional cookies you
					allow by resetting your cookie consent.
				</p>

				<button
					type="button"
					onclick={() => {
						if (typeof window !== 'undefined') {
							localStorage.removeItem('cookie-consent');
							window.location.reload();
						}
					}}
					class="btn btn-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
				>
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
					Reset Cookie Preferences
				</button>
			</div>

			<!-- Privacy Policy Link -->
			<div class="bg-white rounded-card shadow-card p-6">
				<div class="flex items-center gap-3 mb-1">
					<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					<h2 class="font-display text-lg font-semibold text-secondary">Privacy Policy</h2>
				</div>
				<p class="text-sm text-gray-500 mb-6">
					Learn more about how we collect, use, and protect your personal data.
				</p>
				<a
					href="/privacy"
					class="btn btn-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center"
				>
					<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
					</svg>
					View Privacy Policy
				</a>
			</div>

			<!-- Delete Account (GDPR) -->
			<div class="bg-white rounded-card shadow-card border-2 border-error/20 overflow-hidden">
				<div class="p-6">
					<div class="flex items-center gap-3 mb-1">
						<svg class="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
						<h2 class="font-display text-lg font-semibold text-error">Delete My Account</h2>
					</div>
					<p class="text-sm text-gray-500 mb-4">
						Permanently delete your account and anonymise all associated personal data. Your
						booking history and review ratings will be retained for audit purposes but stripped
						of identifying information. <strong class="text-gray-700">This action cannot be undone.</strong>
					</p>

					{#if gdprDeleteStatus}
						<div class="p-4 mb-4 rounded-lg flex items-center gap-3 {gdprDeleteStatus.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}">
							<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								{#if gdprDeleteStatus.type === 'success'}
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								{:else}
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								{/if}
							</svg>
							{gdprDeleteStatus.message}
						</div>
					{/if}

					{#if !showGdprDeleteModal}
						<button
							type="button"
							onclick={() => (showGdprDeleteModal = true)}
							class="btn btn-md border-2 border-error text-error hover:bg-error/5 transition-colors"
						>
							Delete My Account & Data
						</button>
					{:else}
						<div class="p-4 bg-error/5 rounded-lg border border-error/20 space-y-4">
							<div class="flex items-start gap-3">
								<svg class="w-5 h-5 text-error mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
								<div class="space-y-2">
									<p class="text-sm font-medium text-error">This will permanently:</p>
									<ul class="text-sm text-gray-600 space-y-1 list-disc list-inside">
										<li>Delete your profile and personal information</li>
										<li>Anonymise your messages and reviews</li>
										<li>Deactivate your performer profile</li>
										<li>Sign you out and delete your authentication account</li>
									</ul>
								</div>
							</div>

							<div>
								<label for="gdprDeleteConfirm" class="text-sm text-gray-600">
									Type <span class="font-mono font-bold text-error">DELETE MY ACCOUNT</span> to confirm:
								</label>
								<input
									id="gdprDeleteConfirm"
									type="text"
									bind:value={gdprDeleteConfirmText}
									class="input mt-2 {gdprDeleteConfirmText.length > 0 && !canGdprDelete ? 'input-error' : ''}"
									placeholder="DELETE MY ACCOUNT"
									autocomplete="off"
								/>
							</div>

							<div class="flex items-center gap-3">
								<button
									type="button"
									onclick={deleteAccountGdpr}
									disabled={!canGdprDelete || isGdprDeleting}
									class="btn btn-md bg-error text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									{#if isGdprDeleting}
										<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
										</svg>
										Deleting Account...
									{:else}
										Permanently Delete My Account
									{/if}
								</button>
								<button
									type="button"
									onclick={() => {
										showGdprDeleteModal = false;
										gdprDeleteConfirmText = '';
									}}
									class="btn btn-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
								>
									Cancel
								</button>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Danger Zone (always visible) -->
	<div class="bg-white rounded-card shadow-card border-2 border-error/20 overflow-hidden">
		<div class="p-6">
			<div class="flex items-center gap-3 mb-1">
				<svg class="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
				<h2 class="font-display text-lg font-semibold text-error">Danger Zone</h2>
			</div>

			<!-- Danger zone success/error -->
			{#if form?.section === 'danger' && form?.success}
				<div class="p-4 bg-success/10 text-success rounded-lg flex items-center gap-3 my-4">
					<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					{form.message}
				</div>
			{/if}
			{#if form?.section === 'danger' && form?.error}
				<div class="p-4 bg-error/10 text-error rounded-lg flex items-center gap-3 my-4">
					<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					{form.error}
				</div>
			{/if}

			<p class="text-sm text-gray-500 mb-6">
				Once you deactivate your account, your profile will be hidden from search and you will
				not receive new bookings. This action can be reversed by contacting support.
			</p>

			{#if !showDeleteConfirm}
				<button
					type="button"
					onclick={() => (showDeleteConfirm = true)}
					class="btn btn-md border-2 border-error text-error hover:bg-error/5 transition-colors"
				>
					Deactivate Account
				</button>
			{:else}
				<div class="p-4 bg-error/5 rounded-lg border border-error/20 space-y-4">
					<p class="text-sm font-medium text-error">
						Are you sure? This will deactivate your account and hide your profile.
					</p>
					<div>
						<label for="deleteConfirm" class="text-sm text-gray-600">
							Type <span class="font-mono font-bold text-error">DELETE</span> to confirm:
						</label>
						<input
							id="deleteConfirm"
							type="text"
							bind:value={deleteConfirmText}
							class="input mt-2 {deleteConfirmText.length > 0 && !canDeleteAccount ? 'input-error' : ''}"
							placeholder="DELETE"
							autocomplete="off"
						/>
					</div>
					<div class="flex items-center gap-3">
						<form
							method="POST"
							action="?/deleteAccount"
							use:enhance={() => {
								isDeletingAccount = true;
								return async ({ update }) => {
									isDeletingAccount = false;
									showDeleteConfirm = false;
									deleteConfirmText = '';
									await update();
								};
							}}
						>
							<button
								type="submit"
								disabled={!canDeleteAccount || isDeletingAccount}
								class="btn btn-md bg-error text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{#if isDeletingAccount}
									<svg
										class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
										></path>
									</svg>
									Processing...
								{:else}
									Deactivate My Account
								{/if}
							</button>
						</form>
						<button
							type="button"
							onclick={() => {
								showDeleteConfirm = false;
								deleteConfirmText = '';
							}}
							class="btn btn-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
