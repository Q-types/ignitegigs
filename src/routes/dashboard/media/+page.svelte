<script lang="ts">
	import { enhance } from '$app/forms';
	import { Modal, Badge } from '$lib/components/ui';
	import type { ActionData } from './$types';

	let { data, form }: { data: typeof import('./$types').PageData; form: ActionData } = $props();

	// ── Upload modal state ──────────────────────────────────────────
	let showUploadModal = $state(false);
	let showDeleteModal = $state(false);
	let mediaToDelete = $state<string | null>(null);
	let uploadType = $state<'video' | 'photo'>('video');
	let isUploading = $state(false);
	let selectedFile = $state<File | null>(null);
	let title = $state('');
	let description = $state('');
	let isPrimary = $state(false);

	// ── Drag-and-drop upload zone state ─────────────────────────────
	let isDraggingOver = $state(false);
	let fileInputRef = $state<HTMLInputElement | null>(null);
	let validationError = $state<string | null>(null);

	// ── File preview state ──────────────────────────────────────────
	let previewUrl = $state<string | null>(null);
	let previewIsVideo = $state(false);

	// ── Gallery drag-and-drop reorder state ─────────────────────────
	let draggedItemId = $state<string | null>(null);
	let dragOverItemId = $state<string | null>(null);
	let isReordering = $state(false);
	let reorderFormRef = $state<HTMLFormElement | null>(null);
	let reorderItemsInput = $state<HTMLInputElement | null>(null);

	// ── Derived data ────────────────────────────────────────────────
	const videos = $derived(data.media.filter((m) => m.media_type === 'video'));
	const photos = $derived(data.media.filter((m) => m.media_type === 'photo'));

	// ── Validation constants ────────────────────────────────────────
	const VIDEO_MAX_SIZE = 50 * 1024 * 1024; // 50MB
	const PHOTO_MAX_SIZE = 10 * 1024 * 1024; // 10MB
	const VIDEO_ACCEPTED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
	const PHOTO_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

	// ── Cleanup preview URL on change ───────────────────────────────
	$effect(() => {
		// This effect depends on previewUrl via the cleanup return
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	});

	// ── Helpers ─────────────────────────────────────────────────────

	function validateFile(file: File, type: 'video' | 'photo'): string | null {
		const maxSize = type === 'video' ? VIDEO_MAX_SIZE : PHOTO_MAX_SIZE;
		const acceptedTypes = type === 'video' ? VIDEO_ACCEPTED_TYPES : PHOTO_ACCEPTED_TYPES;

		if (!acceptedTypes.includes(file.type)) {
			const allowed = acceptedTypes.map((t) => t.split('/')[1]).join(', ');
			return `Invalid file type "${file.type || 'unknown'}". Accepted: ${allowed}`;
		}

		if (file.size > maxSize) {
			const maxMB = maxSize / (1024 * 1024);
			const fileMB = (file.size / (1024 * 1024)).toFixed(1);
			return `File too large (${fileMB}MB). Maximum size is ${maxMB}MB`;
		}

		return null;
	}

	function detectMediaType(file: File): 'video' | 'photo' {
		if (file.type.startsWith('video/')) return 'video';
		return 'photo';
	}

	function generatePreview(file: File) {
		// Revoke old preview
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			previewUrl = null;
		}

		const url = URL.createObjectURL(file);
		previewIsVideo = file.type.startsWith('video/');
		previewUrl = url;
	}

	function clearPreview() {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			previewUrl = null;
		}
		previewIsVideo = false;
	}

	function processSelectedFile(file: File) {
		validationError = null;

		// Auto-detect type from MIME
		const detectedType = detectMediaType(file);
		uploadType = detectedType;

		// Validate
		const error = validateFile(file, detectedType);
		if (error) {
			validationError = error;
			selectedFile = null;
			clearPreview();
			return;
		}

		selectedFile = file;
		generatePreview(file);

		// Sync with the native file input using DataTransfer
		if (fileInputRef) {
			const dt = new DataTransfer();
			dt.items.add(file);
			fileInputRef.files = dt.files;
		}
	}

	// ── Upload modal actions ────────────────────────────────────────

	function openUpload(type: 'video' | 'photo') {
		uploadType = type;
		selectedFile = null;
		title = '';
		description = '';
		isPrimary = false;
		validationError = null;
		isDraggingOver = false;
		clearPreview();
		showUploadModal = true;
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files?.[0]) {
			processSelectedFile(input.files[0]);
		}
	}

	function confirmDelete(id: string) {
		mediaToDelete = id;
		showDeleteModal = true;
	}

	// ── Drag-and-drop upload zone handlers ──────────────────────────

	function handleDropZoneDragEnter(e: DragEvent) {
		e.preventDefault();
		isDraggingOver = true;
	}

	function handleDropZoneDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'copy';
		}
		isDraggingOver = true;
	}

	function handleDropZoneDragLeave(e: DragEvent) {
		e.preventDefault();
		// Only set to false if we're leaving the drop zone itself, not a child
		const relatedTarget = e.relatedTarget as HTMLElement | null;
		const currentTarget = e.currentTarget as HTMLElement;
		if (!currentTarget.contains(relatedTarget)) {
			isDraggingOver = false;
		}
	}

	function handleDropZoneDrop(e: DragEvent) {
		e.preventDefault();
		isDraggingOver = false;

		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			processSelectedFile(files[0]);
		}
	}

	// ── Gallery drag-and-drop reorder handlers ──────────────────────

	function handleGalleryDragStart(e: DragEvent, itemId: string) {
		draggedItemId = itemId;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', itemId);
		}
		// Add a slight delay so the dragged element gets its styling
		const target = e.currentTarget as HTMLElement;
		requestAnimationFrame(() => {
			target.style.opacity = '0.5';
		});
	}

	function handleGalleryDragEnd(e: DragEvent) {
		const target = e.currentTarget as HTMLElement;
		target.style.opacity = '1';
		draggedItemId = null;
		dragOverItemId = null;
	}

	function handleGalleryDragOver(e: DragEvent, itemId: string) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		if (draggedItemId && draggedItemId !== itemId) {
			dragOverItemId = itemId;
		}
	}

	function handleGalleryDragLeave() {
		dragOverItemId = null;
	}

	function handleGalleryDrop(e: DragEvent, targetId: string, mediaType: 'video' | 'photo') {
		e.preventDefault();
		dragOverItemId = null;

		if (!draggedItemId || draggedItemId === targetId) return;

		const items = mediaType === 'video' ? [...videos] : [...photos];
		const draggedIndex = items.findIndex((m) => m.id === draggedItemId);
		const targetIndex = items.findIndex((m) => m.id === targetId);

		if (draggedIndex === -1 || targetIndex === -1) return;

		// Reorder the array
		const [movedItem] = items.splice(draggedIndex, 1);
		items.splice(targetIndex, 0, movedItem);

		// Build the sort_order update payload
		const reorderPayload = items.map((item, index) => ({
			id: item.id,
			sort_order: index + 1
		}));

		// Submit via the hidden reorder form
		if (reorderItemsInput && reorderFormRef) {
			reorderItemsInput.value = JSON.stringify(reorderPayload);
			reorderFormRef.requestSubmit();
		}

		draggedItemId = null;
	}

	// ── Format file size ────────────────────────────────────────────
	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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

	<!-- Hidden reorder form -->
	<form
		bind:this={reorderFormRef}
		method="POST"
		action="?/reorder"
		class="hidden"
		use:enhance={() => {
			isReordering = true;
			return async ({ update }) => {
				isReordering = false;
				await update();
			};
		}}
	>
		<input bind:this={reorderItemsInput} type="hidden" name="items" value="" />
	</form>

	<!-- Videos Section -->
	<div class="bg-white rounded-card shadow-card p-6">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<h2 class="font-display text-lg font-semibold text-secondary">
					Videos ({videos.length})
				</h2>
				{#if isReordering}
					<span class="inline-flex items-center gap-1 text-xs text-gray-500">
						<svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
						</svg>
						Saving order...
					</span>
				{/if}
			</div>
			<button class="btn-primary btn-sm" onclick={() => openUpload('video')}>
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				Upload Video
			</button>
		</div>

		{#if videos.length > 0}
			<p class="text-xs text-gray-400 mb-3">Drag items to reorder</p>
			<div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
				{#each videos as video (video.id)}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200
							{dragOverItemId === video.id ? 'ring-2 ring-primary ring-offset-2 scale-[1.02]' : ''}
							{draggedItemId === video.id ? 'opacity-50' : ''}"
						draggable="true"
						ondragstart={(e) => handleGalleryDragStart(e, video.id)}
						ondragend={handleGalleryDragEnd}
						ondragover={(e) => handleGalleryDragOver(e, video.id)}
						ondragleave={handleGalleryDragLeave}
						ondrop={(e) => handleGalleryDrop(e, video.id, 'video')}
					>
						<video
							src={video.url}
							poster={video.thumbnail_url || undefined}
							class="w-full h-full object-cover pointer-events-none"
							muted
						>
							<track kind="captions" />
						</video>

						{#if video.is_primary}
							<div class="absolute top-2 left-2">
								<Badge variant="success" size="sm">Primary</Badge>
							</div>
						{/if}

						<!-- Drag handle indicator -->
						<div class="absolute top-2 right-2 opacity-0 group-hover:opacity-70 transition-opacity pointer-events-none">
							<svg class="w-5 h-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8-16a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
							</svg>
						</div>

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
			<div class="flex items-center gap-3">
				<h2 class="font-display text-lg font-semibold text-secondary">
					Photos ({photos.length})
				</h2>
				{#if isReordering}
					<span class="inline-flex items-center gap-1 text-xs text-gray-500">
						<svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
						</svg>
						Saving order...
					</span>
				{/if}
			</div>
			<button class="btn-outline btn-sm" onclick={() => openUpload('photo')}>
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				Upload Photo
			</button>
		</div>

		{#if photos.length > 0}
			<p class="text-xs text-gray-400 mb-3">Drag items to reorder</p>
			<div class="grid grid-cols-3 lg:grid-cols-4 gap-4">
				{#each photos as photo (photo.id)}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200
							{dragOverItemId === photo.id ? 'ring-2 ring-primary ring-offset-2 scale-[1.02]' : ''}
							{draggedItemId === photo.id ? 'opacity-50' : ''}"
						draggable="true"
						ondragstart={(e) => handleGalleryDragStart(e, photo.id)}
						ondragend={handleGalleryDragEnd}
						ondragover={(e) => handleGalleryDragOver(e, photo.id)}
						ondragleave={handleGalleryDragLeave}
						ondrop={(e) => handleGalleryDrop(e, photo.id, 'photo')}
					>
						<img
							src={photo.thumbnail_url || photo.url}
							alt={photo.title || 'Performance photo'}
							class="w-full h-full object-cover pointer-events-none"
						/>

						{#if photo.is_primary}
							<div class="absolute top-2 left-2">
								<Badge variant="success" size="sm">Primary</Badge>
							</div>
						{/if}

						<!-- Drag handle indicator -->
						<div class="absolute top-2 right-2 opacity-0 group-hover:opacity-70 transition-opacity pointer-events-none">
							<svg class="w-5 h-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8-16a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
							</svg>
						</div>

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
				selectedFile = null;
				clearPreview();
				validationError = null;
				await update();
			};
		}}
		class="space-y-4"
	>
		<input type="hidden" name="mediaType" value={uploadType} />

		<!-- Drag-and-drop zone + file input -->
		<div>
			<label class="label">
				{uploadType === 'video' ? 'Video File' : 'Photo'}
			</label>

			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200
					{isDraggingOver
						? 'border-primary bg-primary/5'
						: validationError
							? 'border-error/50 bg-error/5'
							: selectedFile
								? 'border-success/50 bg-success/5'
								: 'border-gray-300 hover:border-gray-400 bg-gray-50'}"
				ondragenter={handleDropZoneDragEnter}
				ondragover={handleDropZoneDragOver}
				ondragleave={handleDropZoneDragLeave}
				ondrop={handleDropZoneDrop}
			>
				{#if previewUrl && selectedFile}
					<!-- File preview -->
					<div class="space-y-3">
						<div class="mx-auto w-full max-w-xs overflow-hidden rounded-lg bg-gray-100">
							{#if previewIsVideo}
								<!-- svelte-ignore a11y_media_has_caption -->
								<video
									src={previewUrl}
									class="w-full max-h-40 object-contain"
									muted
									playsinline
									preload="metadata"
								></video>
							{:else}
								<img
									src={previewUrl}
									alt="Preview"
									class="w-full max-h-40 object-contain"
								/>
							{/if}
						</div>
						<div>
							<p class="text-sm font-medium text-gray-700 truncate">{selectedFile.name}</p>
							<p class="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
						</div>
						<button
							type="button"
							class="text-xs text-gray-500 underline hover:text-gray-700"
							onclick={() => {
								selectedFile = null;
								clearPreview();
								validationError = null;
								if (fileInputRef) fileInputRef.value = '';
							}}
						>
							Choose a different file
						</button>
					</div>
				{:else}
					<!-- Drop zone prompt -->
					<div class="space-y-2">
						<svg
							class="mx-auto h-10 w-10 transition-colors duration-200
								{isDraggingOver ? 'text-primary' : 'text-gray-400'}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
						</svg>
						<div>
							<p class="text-sm text-gray-600">
								{#if isDraggingOver}
									<span class="font-semibold text-primary">Drop file here</span>
								{:else}
									<span class="font-semibold text-primary">Click to upload</span> or drag and drop
								{/if}
							</p>
							<p class="text-xs text-gray-400 mt-1">
								{#if uploadType === 'video'}
									MP4, WebM, or QuickTime up to 50MB
								{:else}
									JPEG, PNG, or WebP up to 10MB
								{/if}
							</p>
						</div>
					</div>
				{/if}

				<!-- Hidden native file input overlaying the drop zone -->
				<input
					bind:this={fileInputRef}
					type="file"
					name="file"
					accept={uploadType === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/jpeg,image/png,image/webp'}
					required
					onchange={handleFileSelect}
					class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
				/>
			</div>

			<!-- Validation error message -->
			{#if validationError}
				<div class="mt-2 flex items-start gap-2 text-error">
					<svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<p class="text-sm">{validationError}</p>
				</div>
			{/if}
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
			<button
				type="button"
				class="btn-outline flex-1"
				onclick={() => {
					showUploadModal = false;
					clearPreview();
					validationError = null;
				}}
			>
				Cancel
			</button>
			<button
				type="submit"
				disabled={isUploading || !selectedFile || !!validationError}
				class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
			>
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
