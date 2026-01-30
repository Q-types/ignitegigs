<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	interface UserRow {
		id: string;
		email: string;
		full_name: string;
		avatar_url: string | null;
		phone: string | null;
		user_type: 'performer' | 'client' | 'both';
		email_verified: boolean;
		created_at: string;
		updated_at: string;
	}

	interface UsersPageData {
		users: UserRow[];
		totalCount: number;
		currentPage: number;
		totalPages: number;
		search: string;
		userType: string;
	}

	let { data }: { data: UsersPageData } = $props();

	let searchValue = $state(data.search);
	let typeFilter = $state(data.userType);

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function getUserTypeBadge(type: string): string {
		const badges: Record<string, string> = {
			performer: 'bg-purple-100 text-purple-700',
			client: 'bg-blue-100 text-blue-700',
			both: 'bg-green-100 text-green-700'
		};
		return badges[type] ?? 'bg-gray-100 text-gray-600';
	}

	function applyFilters() {
		const params = new URLSearchParams();
		if (searchValue.trim()) params.set('search', searchValue.trim());
		if (typeFilter !== 'all') params.set('type', typeFilter);
		const qs = params.toString();
		goto(`/admin/users${qs ? '?' + qs : ''}`);
	}

	function goToPage(pageNum: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', String(pageNum));
		goto(`/admin/users?${params.toString()}`);
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Users</h1>
			<p class="mt-1 text-sm text-gray-500">{data.totalCount.toLocaleString('en-GB')} total users on the platform.</p>
		</div>
	</div>

	<!-- Filters -->
	<div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
		<div class="flex flex-col sm:flex-row gap-3">
			<!-- Search -->
			<div class="flex-1">
				<label for="search" class="sr-only">Search users</label>
				<div class="relative">
					<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<input
						id="search"
						type="text"
						placeholder="Search by name or email..."
						bind:value={searchValue}
						onkeydown={(e) => { if (e.key === 'Enter') applyFilters(); }}
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:border-transparent focus:outline-none"
						style="focus:ring-color: #FF6B35;"
					/>
				</div>
			</div>

			<!-- Type Filter -->
			<div class="sm:w-44">
				<label for="type-filter" class="sr-only">Filter by type</label>
				<select
					id="type-filter"
					bind:value={typeFilter}
					onchange={() => applyFilters()}
					class="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:border-transparent focus:outline-none"
				>
					<option value="all">All Types</option>
					<option value="client">Clients</option>
					<option value="performer">Performers</option>
					<option value="both">Both</option>
				</select>
			</div>

			<!-- Search Button -->
			<button
				type="button"
				onclick={() => applyFilters()}
				class="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-90"
				style="background-color: #FF6B35;"
			>
				Search
			</button>
		</div>
	</div>

	<!-- Users Table -->
	<div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-gray-200 bg-gray-50 text-left">
						<th class="px-5 py-3 font-medium text-gray-500">User</th>
						<th class="px-5 py-3 font-medium text-gray-500">Email</th>
						<th class="px-5 py-3 font-medium text-gray-500">Type</th>
						<th class="px-5 py-3 font-medium text-gray-500">Verified</th>
						<th class="px-5 py-3 font-medium text-gray-500">Joined</th>
						<th class="px-5 py-3 font-medium text-gray-500">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each data.users as user}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-5 py-3">
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
										{#if user.avatar_url}
											<img
												src={user.avatar_url}
												alt={user.full_name}
												class="w-8 h-8 rounded-full object-cover"
											/>
										{:else}
											<span class="text-xs font-medium text-gray-600">
												{user.full_name.charAt(0).toUpperCase()}
											</span>
										{/if}
									</div>
									<span class="font-medium text-gray-900">{user.full_name}</span>
								</div>
							</td>
							<td class="px-5 py-3 text-gray-600">{user.email}</td>
							<td class="px-5 py-3">
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize {getUserTypeBadge(user.user_type)}">
									{user.user_type}
								</span>
							</td>
							<td class="px-5 py-3">
								{#if user.email_verified}
									<span class="inline-flex items-center gap-1 text-green-600">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
										Yes
									</span>
								{:else}
									<span class="text-gray-400">No</span>
								{/if}
							</td>
							<td class="px-5 py-3 text-gray-600">{formatDate(user.created_at)}</td>
							<td class="px-5 py-3">
								<div class="flex items-center gap-2">
									<a
										href="/admin/users/{user.id}"
										class="text-xs font-medium px-2.5 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
									>
										View
									</a>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="px-5 py-12 text-center text-gray-400">
								{#if data.search}
									No users found matching "{data.search}".
								{:else}
									No users found.
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if data.totalPages > 1}
			<div class="px-5 py-4 border-t border-gray-200 flex items-center justify-between">
				<p class="text-sm text-gray-500">
					Page {data.currentPage} of {data.totalPages}
					<span class="hidden sm:inline">&middot; {data.totalCount.toLocaleString('en-GB')} total</span>
				</p>
				<div class="flex items-center gap-2">
					<button
						type="button"
						disabled={data.currentPage <= 1}
						onclick={() => goToPage(data.currentPage - 1)}
						class="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
					>
						Previous
					</button>
					<button
						type="button"
						disabled={data.currentPage >= data.totalPages}
						onclick={() => goToPage(data.currentPage + 1)}
						class="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
					>
						Next
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
