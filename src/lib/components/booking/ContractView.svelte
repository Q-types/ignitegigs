<script lang="ts">
	let {
		contract,
		userRole,
		onSign
	}: {
		contract: {
			id: string;
			contract_text: string;
			status: string;
			performer_signed: boolean;
			performer_signed_at: string | null;
			client_signed: boolean;
			client_signed_at: string | null;
			cancellation_terms: string | null;
		};
		userRole: 'performer' | 'client';
		onSign: () => void;
	} = $props();

	let agreedToTerms = $state(false);
	let signing = $state(false);

	const hasSigned = $derived(
		userRole === 'performer' ? contract.performer_signed : contract.client_signed
	);

	const otherPartySigned = $derived(
		userRole === 'performer' ? contract.client_signed : contract.performer_signed
	);

	async function handleSign() {
		if (!agreedToTerms || signing) return;
		signing = true;

		try {
			const res = await fetch('/api/contracts/sign', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ contractId: contract.id, role: userRole })
			});

			if (res.ok) {
				onSign();
			}
		} finally {
			signing = false;
		}
	}

	function formatDate(date: string | null): string {
		if (!date) return '';
		return new Date(date).toLocaleDateString('en-GB', {
			day: 'numeric', month: 'long', year: 'numeric',
			hour: '2-digit', minute: '2-digit'
		});
	}
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
	<!-- Header -->
	<div class="px-6 py-4 bg-secondary text-white flex items-center justify-between">
		<h3 class="font-display text-lg font-semibold">Booking Agreement</h3>
		<span class="px-3 py-1 rounded-full text-xs font-medium {
			contract.status === 'signed' ? 'bg-green-500/20 text-green-200' :
			contract.status === 'pending' ? 'bg-yellow-500/20 text-yellow-200' :
			contract.status === 'voided' ? 'bg-red-500/20 text-red-200' :
			'bg-gray-500/20 text-gray-200'
		}">
			{contract.status === 'signed' ? 'Fully Signed' :
			 contract.status === 'pending' ? 'Awaiting Signature' :
			 contract.status === 'voided' ? 'Voided' : 'Draft'}
		</span>
	</div>

	<!-- Contract Text -->
	<div class="p-6">
		<div class="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto border border-gray-200">
			<pre class="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">{contract.contract_text}</pre>
		</div>
	</div>

	<!-- Signature Status -->
	<div class="px-6 pb-4">
		<div class="grid grid-cols-2 gap-4">
			<div class="p-4 rounded-lg border {contract.performer_signed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}">
				<p class="text-sm font-medium text-gray-700">Performer</p>
				{#if contract.performer_signed}
					<p class="text-sm text-green-600 mt-1">Signed {formatDate(contract.performer_signed_at)}</p>
				{:else}
					<p class="text-sm text-gray-400 mt-1">Not yet signed</p>
				{/if}
			</div>
			<div class="p-4 rounded-lg border {contract.client_signed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}">
				<p class="text-sm font-medium text-gray-700">Client</p>
				{#if contract.client_signed}
					<p class="text-sm text-green-600 mt-1">Signed {formatDate(contract.client_signed_at)}</p>
				{:else}
					<p class="text-sm text-gray-400 mt-1">Not yet signed</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Sign Section -->
	{#if !hasSigned && contract.status !== 'voided'}
		<div class="px-6 pb-6 border-t border-gray-100 pt-4">
			<label class="flex items-start gap-3 cursor-pointer">
				<input
					type="checkbox"
					bind:checked={agreedToTerms}
					class="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
				/>
				<span class="text-sm text-gray-700">
					I have read and agree to the terms of this booking agreement. I understand this constitutes a legally binding agreement.
				</span>
			</label>

			<button
				class="btn-primary w-full mt-4"
				disabled={!agreedToTerms || signing}
				onclick={handleSign}
			>
				{signing ? 'Signing...' : 'Sign Agreement'}
			</button>
		</div>
	{:else if hasSigned && !otherPartySigned}
		<div class="px-6 pb-6">
			<p class="text-sm text-gray-500 text-center">
				You have signed this agreement. Waiting for the other party to sign.
			</p>
		</div>
	{/if}
</div>
