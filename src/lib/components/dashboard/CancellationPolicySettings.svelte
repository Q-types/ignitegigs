<script lang="ts">
	import { enhance } from '$app/forms';

	let {
		currentPolicy = 'standard'
	}: {
		currentPolicy: string;
	} = $props();

	let policy = $state(currentPolicy);
	let saving = $state(false);

	const policies = [
		{
			value: 'flexible',
			label: 'Flexible',
			description:
				'Full refund if cancelled 7+ days before. 50% refund 3-7 days. No refund under 3 days.',
			icon: '🟢'
		},
		{
			value: 'standard',
			label: 'Standard',
			description:
				'Full refund if cancelled 14+ days before. 50% refund 7-14 days. No refund under 7 days.',
			icon: '🟡'
		},
		{
			value: 'strict',
			label: 'Strict',
			description:
				'Full refund if cancelled 30+ days before. 50% refund 14-30 days. No refund under 14 days.',
			icon: '🔴'
		}
	];
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
	<h3 class="font-display text-lg font-semibold text-gray-900 mb-2">Cancellation Policy</h3>
	<p class="text-sm text-gray-600 mb-6">
		Choose a cancellation policy for your bookings. This will be included in all booking contracts.
	</p>

	<form
		method="POST"
		action="?/updateCancellationPolicy"
		use:enhance={() => {
			saving = true;
			return async ({ update }) => {
				saving = false;
				await update();
			};
		}}
	>
		<div class="space-y-3">
			{#each policies as p}
				<label
					class="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all {policy ===
					p.value
						? 'border-[#FF6B35] bg-[#FF6B35]/5'
						: 'border-gray-200 hover:border-gray-300'}"
				>
					<input
						type="radio"
						name="cancellationPolicy"
						value={p.value}
						bind:group={policy}
						class="mt-1 text-[#FF6B35] focus:ring-[#FF6B35]"
					/>
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<span>{p.icon}</span>
							<span class="font-medium text-gray-900">{p.label}</span>
						</div>
						<p class="text-sm text-gray-600 mt-1">{p.description}</p>
					</div>
				</label>
			{/each}
		</div>

		<button type="submit" class="btn-primary mt-6 w-full" disabled={saving}>
			{saving ? 'Saving...' : 'Save Policy'}
		</button>
	</form>

	<div class="mt-4 p-4 bg-gray-50 rounded-lg">
		<p class="text-xs text-gray-500">
			If you cancel a confirmed booking, the client always receives a full refund regardless of
			your policy. This policy only applies to client-initiated cancellations.
		</p>
	</div>
</div>
