<script lang="ts">
	import type { PerformerProfile, PerformerMedia } from '$types/database';
	import PerformerCard from './PerformerCard.svelte';

	type PerformerWithMedia = PerformerProfile & {
		primary_media?: PerformerMedia | null;
		user?: { full_name: string; avatar_url: string | null } | null;
	};

	interface Props {
		performers: PerformerWithMedia[];
		loading?: boolean;
		emptyMessage?: string;
	}

	let { performers, loading = false, emptyMessage = 'No performers found' }: Props = $props();

	// Generate skeleton cards for loading state
	const skeletonCount = 6;
</script>

{#if loading}
	<!-- Loading Skeleton State -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each Array(skeletonCount) as _, i}
			<div class="card animate-pulse">
				<!-- Media skeleton -->
				<div class="aspect-[4/3] bg-gray-200"></div>
				<!-- Content skeleton -->
				<div class="p-4 space-y-3">
					<div class="flex items-start justify-between">
						<div class="space-y-2 flex-1">
							<div class="h-5 bg-gray-200 rounded w-3/4"></div>
							<div class="h-4 bg-gray-200 rounded w-1/2"></div>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<div class="h-4 bg-gray-200 rounded w-16"></div>
						<div class="h-4 bg-gray-200 rounded w-12"></div>
					</div>
					<div class="flex gap-1.5">
						<div class="h-5 bg-gray-200 rounded-full w-16"></div>
						<div class="h-5 bg-gray-200 rounded-full w-20"></div>
						<div class="h-5 bg-gray-200 rounded-full w-14"></div>
					</div>
					<div class="pt-3 border-t border-gray-100 flex justify-between">
						<div class="h-4 bg-gray-200 rounded w-10"></div>
						<div class="h-6 bg-gray-200 rounded w-20"></div>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else if performers.length === 0}
	<!-- Empty State -->
	<div class="text-center py-16 px-4">
		<div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
			<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
		</div>
		<h3 class="text-xl font-display font-semibold text-gray-900 mb-2">No performers found</h3>
		<p class="text-gray-500 max-w-md mx-auto">{emptyMessage}</p>
		<p class="text-gray-400 text-sm mt-4">
			Try adjusting your filters or search criteria to find available performers.
		</p>
	</div>
{:else}
	<!-- Performer Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each performers as performer (performer.id)}
			<PerformerCard {performer} />
		{/each}
	</div>
{/if}
