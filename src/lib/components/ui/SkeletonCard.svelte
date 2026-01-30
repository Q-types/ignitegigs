<script lang="ts">
	import Skeleton from './Skeleton.svelte';
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
	<!-- Image placeholder -->
	<Skeleton height="0" class="aspect-[4/3] !h-auto" rounded="rounded-none" />

	<!-- Content -->
	<div class="p-4 space-y-3">
		<!-- Title -->
		<Skeleton width="60%" height="1.25rem" rounded="rounded" />

		<!-- Subtitle (location) -->
		<Skeleton width="40%" height="0.875rem" rounded="rounded" />

		<!-- Rating line -->
		<Skeleton width="30%" height="0.875rem" rounded="rounded" />

		<!-- Act type tags -->
		<div class="flex gap-1.5">
			<Skeleton width="4rem" height="1.25rem" rounded="rounded-full" />
			<Skeleton width="3.5rem" height="1.25rem" rounded="rounded-full" />
			<Skeleton width="5rem" height="1.25rem" rounded="rounded-full" />
		</div>

		<!-- Price row -->
		<div class="flex items-center justify-between pt-3 border-t border-gray-100">
			<Skeleton width="2.5rem" height="0.875rem" rounded="rounded" />
			<Skeleton width="4rem" height="1.25rem" rounded="rounded" />
		</div>
	</div>
</div>
