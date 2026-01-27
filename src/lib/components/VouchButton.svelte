<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	interface Props {
		performerId: string;
		performerName: string;
		currentUserId: string | null;
		hasVouched?: boolean;
		isOwnProfile?: boolean;
		hasCompleteProfile?: boolean;
		onVouchSuccess?: () => void;
	}

	let {
		performerId,
		performerName,
		currentUserId,
		hasVouched = false,
		isOwnProfile = false,
		hasCompleteProfile = false,
		onVouchSuccess
	}: Props = $props();

	let modalOpen = $state(false);
	let vouchType = $state('skill');
	let message = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);

	const vouchTypeOptions = [
		{ value: 'skill', label: 'Technical Skill - Great at their craft' },
		{ value: 'professionalism', label: 'Professionalism - Conducts themselves well' },
		{ value: 'safety', label: 'Safety - Practices safe performance' },
		{ value: 'reliability', label: 'Reliability - Always shows up prepared' }
	];

	const canVouch = $derived(
		currentUserId !== null && !isOwnProfile && !hasVouched && hasCompleteProfile
	);

	const buttonText = $derived(() => {
		if (!currentUserId) return 'Sign in to vouch';
		if (isOwnProfile) return "Can't vouch for yourself";
		if (hasVouched) return 'Already vouched';
		if (!hasCompleteProfile) return 'Complete profile to vouch';
		return `Vouch for ${performerName}`;
	});

	const buttonDisabled = $derived(!canVouch);

	function openModal() {
		if (canVouch) {
			modalOpen = true;
			error = null;
		}
	}

	function closeModal() {
		modalOpen = false;
		vouchType = 'skill';
		message = '';
		error = null;
	}

	async function submitVouch() {
		if (!canVouch) return;

		loading = true;
		error = null;

		try {
			const response = await fetch('/api/vouch', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					performerId,
					vouchType,
					message: message.trim() || null
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to submit vouch');
			}

			closeModal();
			onVouchSuccess?.();
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unexpected error occurred';
		} finally {
			loading = false;
		}
	}
</script>

<Button
	variant={hasVouched ? 'ghost' : 'secondary'}
	size="sm"
	disabled={buttonDisabled}
	onclick={openModal}
>
	{#if hasVouched}
		<svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
			<path
				fill-rule="evenodd"
				d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
				clip-rule="evenodd"
			></path>
		</svg>
	{:else}
		<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
			></path>
		</svg>
	{/if}
	{buttonText()}
</Button>

<Modal bind:open={modalOpen} title="Vouch for {performerName}" size="md" onClose={closeModal}>
	<div class="space-y-4">
		<p class="text-gray-600 text-sm">
			Your vouch helps build trust in the community. When a performer receives 3 vouches, they earn
			the "Community Trusted" badge.
		</p>

		<Select
			label="What are you vouching for?"
			options={vouchTypeOptions}
			bind:value={vouchType}
			placeholder="Select vouch type"
		/>

		<div class="w-full">
			<label for="vouch-message" class="block text-sm font-medium text-secondary mb-1.5">
				Message (optional)
			</label>
			<textarea
				id="vouch-message"
				bind:value={message}
				rows={3}
				maxlength={500}
				placeholder="Share why you're vouching for this performer..."
				class="block w-full px-4 py-3 rounded-input border border-gray-200 bg-white text-secondary transition-all duration-200 focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/20 resize-none"
			></textarea>
			<p class="mt-1 text-xs text-gray-400 text-right">{message.length}/500</p>
		</div>

		{#if error}
			<div class="p-3 bg-error/10 border border-error/20 rounded-lg">
				<p class="text-sm text-error">{error}</p>
			</div>
		{/if}
	</div>

	{#snippet footer()}
		<div class="flex justify-end gap-3">
			<Button variant="ghost" onclick={closeModal} disabled={loading}>Cancel</Button>
			<Button variant="primary" onclick={submitVouch} {loading} disabled={loading}>
				{loading ? 'Submitting...' : 'Submit Vouch'}
			</Button>
		</div>
	{/snippet}
</Modal>
