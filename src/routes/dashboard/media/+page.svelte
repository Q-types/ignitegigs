<script lang="ts">
	import { enhance } from '$app/forms';
	import { Modal, Badge } from '$lib/components/ui';
	import type { ActionData } from './$types';

	let { data, form }: { data: typeof import('./$types').PageData; form: ActionData } = $props();

	let showUploadModal = $state(false);
	let showDeleteModal = $state(false);
	let mediaToDelete = $state<string | null>(null);
	let uploadType = $state<'video' | 'photo'>('video');
	let isUploading = $state(false);
	let selectedFile = $state<File | null>(null);
	let title = $state('');
	let description = $state('');
	let isPrimary = $state(false);

	const videos = $derived(data.media.filter((m) => m.media_type === 'video'));
	const photos = $derived(data.media.filter((m) => m.media_type === 'photo'));

	function openUpload(type: 'video' | 'photo') {
		uploadType = type;
		selectedFile = null;
		title = '';
		description = '';
		isPrimary = false;
		showUploadModal = true;
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files?.[0]) {
			selectedFile = input.files[0];
		}
	}

	function confirmDelete(id: string) {
		mediaToDelete = id;
		showDeleteModal = true;
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold text-secondary">Media Gallery</h1>
			<p class="text-gray-600">Upload videos and photos to showcase your performances</p>
		</div>
	</div>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<div class="p-4 bg-success/10 text-success rounded-lg">
			{form.message}
		</div>
	{/if}

	{#if form?.error}
		<div class="p-4 bg-error/10 text-error rounded-lg">
			{form.error}
		</div>
	{/if}

	<!-- Videos Section -->
	<div class="bg-white rounded-card shadow-card p-6">
		<div class="flex items-center justify-between mb-4">
			<h2 class="font-display text-lg font-semibold text-secondary">
				Videos ({videos.length})
			</h2>
			<button class="btn-primary btn-sm" onclick={() => openUpload('video')}>
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				Upload Video
			</button>
		</div>

		{#if videos.length > 0}
			<div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
				{#each videos as video}
					<div class="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden">
						<video
							src={video.url}
							poster={video.thumbnail_url || undefined}
							class="w-full h-full object-cover"
							muted
						>
							<track kind="captions" />
						</video>

						{#if video.is_primary}
							<div class="absolute top-2 left-2">
								<Badge variant="success" size="sm">Primary</Badge>
							</div>
						{/if}

						<!-- Overlay Actions -->
						<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
							{#if !video.is_primary}
								<form method="POST" action="?/setPrimary" use:enhance>
									<input type="hidden" name="mediaId" value={video.id} />
									<button type="submit" class="p-2 bg-white rounded-full text-gray-700 hover:text-primary" title="Set as primary">
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
										</svg>
									</button>
								</form>
							{/if}
							<button
								class="p-2 bg-white rounded-full text-error hover:text-error/80"
								title="Delete"
								onclick={() => confirmDelete(video.id)}
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
							</button>
						</div>

						{#if video.title}
							<div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
								<p class="text-white text-sm truncate">{video.title}</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-12 bg-gray-50 rounded-lg">
				<svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
				</svg>
				<p class="text-gray-500 mb-4">No videos yet</p>
				<button class="btn-primary btn-sm" onclick={() => openUpload('video')}>
					Upload Your First Video
				</button>
			</div>
		{/if}
	</div>

	<!-- Photos Section -->
	<div class="bg-white rounded-card shadow-card p-6">
		<div class="flex items-center justify-between mb-4">
			<h2 class="font-display text-lg font-semibold text-secondary">
				Photos ({photos.length})
			</h2>
			<button class="btn-outline btn-sm" onclick={() => openUpload('photo')}>
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				Upload Photo
			</button>
		</div>

		{#if photos.length > 0}
			<div class="grid grid-cols-3 lg:grid-cols-4 gap-4">
				{#each photos as photo}
					<div class="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
						<img
							src={photo.thumbnail_url || photo.url}
							alt={photo.title || 'Performance photo'}
							class="w-full h-full object-cover"
						/>

						{#if photo.is_primary}
							<div class="absolute top-2 left-2">
								<Badge variant="success" size="sm">Primary</Badge>
							</div>
						{/if}

						<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
							{#if !photo.is_primary}
								<form method="POST" action="?/setPrimary" use:enhance>
									<input type="hidden" name="mediaId" value={photo.id} />
									<button type="submit" class="p-2 bg-white rounded-full text-gray-700 hover:text-primary" title="Set as primary">
										<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
										</svg>
									</button>
								</form>
							{/if}
							<button
								class="p-2 bg-white rounded-full text-error hover:text-error/80"
								title="Delete"
								onclick={() => confirmDelete(photo.id)}
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
							</button>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-8 text-gray-500">
				<p>No photos yet. Add some to show off your performance style!</p>
			</div>
		{/if}
	</div>
</div>

<!-- Upload Modal -->
<Modal bind:open={showUploadModal} title="Upload {uploadType === 'video' ? 'Video' : 'Photo'}">
	<form
		method="POST"
		action="?/upload"
		enctype="multipart/form-data"
		use:enhance={() => {
			isUploading = true;
			return async ({ update }) => {
				isUploading = false;
				showUploadModal = false;
				await update();
			};
		}}
		class="space-y-4"
	>
		<input type="hidden" name="mediaType" value={uploadType} />

		<div>
			<label class="label">
				{uploadType === 'video' ? 'Video File' : 'Photo'}
			</label>
			<input
				type="file"
				name="file"
				accept={uploadType === 'video' ? 'video/*' : 'image/*'}
				required
				onchange={handleFileSelect}
				class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
			/>
			<p class="text-xs text-gray-400 mt-1">
				Max {uploadType === 'video' ? '50MB' : '10MB'}
			</p>
		</div>

		<div>
			<label for="title" class="label">Title (optional)</label>
			<input
				id="title"
				name="title"
				type="text"
				bind:value={title}
				class="input"
				placeholder="e.g., Fire Poi at Summer Festival"
			/>
		</div>

		<div>
			<label for="description" class="label">Description (optional)</label>
			<textarea
				id="description"
				name="description"
				rows="2"
				bind:value={description}
				class="input"
				placeholder="Brief description of this performance"
			></textarea>
		</div>

		<label class="flex items-center gap-2 cursor-pointer">
			<input
				type="checkbox"
				name="isPrimary"
				value="true"
				bind:checked={isPrimary}
				class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
			/>
			<span class="text-sm text-gray-700">Set as primary {uploadType}</span>
		</label>

		<div class="flex gap-3 pt-4">
			<button type="button" class="btn-outline flex-1" onclick={() => (showUploadModal = false)}>
				Cancel
			</button>
			<button type="submit" disabled={isUploading || !selectedFile} class="btn-primary flex-1">
				{#if isUploading}
					<svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
					</svg>
					Uploading...
				{:else}
					Upload
				{/if}
			</button>
		</div>
	</form>
</Modal>

<!-- Delete Confirmation Modal -->
<Modal bind:open={showDeleteModal} title="Delete Media">
	<p class="text-gray-600 mb-6">
		Are you sure you want to delete this media? This action cannot be undone.
	</p>
	<form
		method="POST"
		action="?/delete"
		use:enhance={() => {
			return async ({ update }) => {
				showDeleteModal = false;
				mediaToDelete = null;
				await update();
			};
		}}
	>
		<input type="hidden" name="mediaId" value={mediaToDelete} />
		<div class="flex gap-3">
			<button type="button" class="btn-outline flex-1" onclick={() => (showDeleteModal = false)}>
				Cancel
			</button>
			<button type="submit" class="btn bg-error text-white hover:bg-error/90 flex-1">
				Delete
			</button>
		</div>
	</form>
</Modal>
