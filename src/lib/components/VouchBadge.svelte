<script lang="ts">
	import Badge from '$lib/components/ui/Badge.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';

	interface Vouch {
		id: string;
		voucher_id: string;
		voucher_stage_name: string | null;
		voucher_avatar_url: string | null;
		voucher_user_id: string;
		message: string | null;
		vouch_type: 'skill' | 'professionalism' | 'safety' | 'reliability';
		created_at: string;
	}

	interface Props {
		vouchCount: number;
		communityTrusted: boolean;
		vouches?: Vouch[];
		showCount?: boolean;
		size?: 'sm' | 'md';
	}

	let {
		vouchCount = 0,
		communityTrusted = false,
		vouches = [],
		showCount = true,
		size = 'md'
	}: Props = $props();

	let modalOpen = $state(false);

	const vouchTypeLabels: Record<string, string> = {
		skill: 'Technical Skill',
		professionalism: 'Professionalism',
		safety: 'Safety',
		reliability: 'Reliability'
	};

	const vouchTypeIcons: Record<string, string> = {
		skill: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
		professionalism:
			'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
		safety:
			'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
		reliability:
			'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
	};

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function openModal() {
		if (vouches.length > 0) {
			modalOpen = true;
		}
	}
</script>

<div class="inline-flex items-center gap-2">
	{#if communityTrusted}
		<button
			type="button"
			onclick={openModal}
			class="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-badge"
			aria-label="View vouches - Community Trusted performer"
		>
			<Badge variant="verified" {size}>
				<svg
					class="w-3.5 h-3.5 mr-1 {size === 'sm' ? 'w-3 h-3' : ''}"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					></path>
				</svg>
				Community Trusted
			</Badge>
		</button>
	{/if}

	{#if showCount && vouchCount > 0}
		<button
			type="button"
			onclick={openModal}
			class="inline-flex items-center text-sm text-gray-500 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1 {size === 'sm' ? 'text-xs' : ''}"
			aria-label="View {vouchCount} vouches"
		>
			<svg class="w-4 h-4 mr-1 {size === 'sm' ? 'w-3.5 h-3.5' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
				></path>
			</svg>
			Vouched by {vouchCount} performer{vouchCount === 1 ? '' : 's'}
		</button>
	{/if}
</div>

<Modal bind:open={modalOpen} title="Community Vouches" size="lg">
	<div class="space-y-4">
		{#if communityTrusted}
			<div class="flex items-center gap-2 p-3 bg-success/10 rounded-lg">
				<svg class="w-5 h-5 text-success shrink-0" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					></path>
				</svg>
				<p class="text-sm text-success font-medium">
					This performer has earned the Community Trusted badge with {vouchCount} vouches from fellow performers.
				</p>
			</div>
		{:else if vouchCount > 0}
			<div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
				<svg class="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<p class="text-sm text-gray-600">
					{3 - vouchCount} more vouch{3 - vouchCount === 1 ? '' : 'es'} needed for the Community Trusted badge.
				</p>
			</div>
		{/if}

		{#if vouches.length === 0}
			<p class="text-center text-gray-500 py-6">No vouches yet.</p>
		{:else}
			<div class="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
				{#each vouches as vouch (vouch.id)}
					<div class="py-4 first:pt-0 last:pb-0">
						<div class="flex items-start gap-3">
							<Avatar
								src={vouch.voucher_avatar_url ?? undefined}
								name={vouch.voucher_stage_name ?? 'Performer'}
								size="md"
							/>
							<div class="flex-1 min-w-0">
								<div class="flex items-center justify-between gap-2 flex-wrap">
									<p class="font-medium text-secondary truncate">
										{vouch.voucher_stage_name ?? 'Anonymous Performer'}
									</p>
									<span class="text-xs text-gray-400 shrink-0">
										{formatDate(vouch.created_at)}
									</span>
								</div>

								<div class="flex items-center gap-1.5 mt-1">
									<svg
										class="w-4 h-4 text-primary"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d={vouchTypeIcons[vouch.vouch_type] || vouchTypeIcons.skill}
										></path>
									</svg>
									<span class="text-sm text-primary font-medium">
										{vouchTypeLabels[vouch.vouch_type] || 'Vouch'}
									</span>
								</div>

								{#if vouch.message}
									<p class="mt-2 text-sm text-gray-600 leading-relaxed">
										"{vouch.message}"
									</p>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</Modal>
