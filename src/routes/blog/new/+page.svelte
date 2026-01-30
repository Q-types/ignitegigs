<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	let { data } = $props();

	let title = $state('');
	let content = $state('');
	let excerpt = $state('');
	let category = $state('tips');
	let coverImageUrl = $state('');
	let tags = $state('');
	let showPreview = $state(false);
	let submitting = $state(false);

	const categories = [
		{ value: 'tips', label: 'Tips & Advice' },
		{ value: 'safety', label: 'Safety' },
		{ value: 'business', label: 'Business' },
		{ value: 'technique', label: 'Technique' },
		{ value: 'gear', label: 'Gear & Equipment' },
		{ value: 'industry', label: 'Industry News' },
		{ value: 'events', label: 'Events' },
		{ value: 'community', label: 'Community' }
	];

	let wordCount = $derived(content.trim() ? content.trim().split(/\s+/).length : 0);
	let readingTime = $derived(Math.max(1, Math.ceil(wordCount / 200)));
</script>

<svelte:head>
	<title>Write an Article - IgniteGigs</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="mb-8">
			<a href="/blog" class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Back to Blog
			</a>
			<h1 class="font-display text-2xl font-bold text-gray-900 mt-4">Write an Article</h1>
			<p class="text-gray-600 mt-2">Share your knowledge and experience with the community.</p>
		</div>

		{#if $page.form?.error}
			<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
				{$page.form.error}
			</div>
		{/if}

		<!-- Toggle between Editor and Preview -->
		<div class="mb-6 flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1 w-fit">
			<button
				class="px-4 py-2 rounded-md text-sm font-medium transition-colors {!showPreview ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'}"
				onclick={() => { showPreview = false; }}
			>
				Editor
			</button>
			<button
				class="px-4 py-2 rounded-md text-sm font-medium transition-colors {showPreview ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'}"
				onclick={() => { showPreview = true; }}
			>
				Preview
			</button>
		</div>

		{#if showPreview}
			<!-- Preview Mode -->
			<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10">
				{#if coverImageUrl}
					<div class="mb-8 rounded-lg overflow-hidden">
						<img src={coverImageUrl} alt={title || 'Cover'} class="w-full aspect-video object-cover" />
					</div>
				{/if}

				<span class="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4 capitalize">
					{categories.find(c => c.value === category)?.label || category}
				</span>

				<h1 class="font-display text-3xl font-bold text-gray-900 mb-4">
					{title || 'Untitled Article'}
				</h1>

				<div class="flex items-center gap-3 text-sm text-gray-500 mb-8">
					<span>{wordCount} words</span>
					<span class="text-gray-300">|</span>
					<span>{readingTime} min read</span>
				</div>

				{#if content}
					<div class="prose prose-lg prose-gray max-w-none
						prose-headings:font-display prose-headings:text-gray-900
						prose-a:text-primary prose-a:no-underline
						prose-strong:text-gray-900">
						{@html content}
					</div>
				{:else}
					<p class="text-gray-400 italic">Start writing to see your preview here...</p>
				{/if}

				{#if tags}
					<div class="mt-8 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-2">
						<span class="text-sm text-gray-500">Tags:</span>
						{#each tags.split(',').map(t => t.trim()).filter(Boolean) as tag}
							<span class="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
								{tag}
							</span>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<!-- Editor Mode -->
			<form method="POST" use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					await update();
				};
			}}>
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
					<div>
						<label for="title" class="label">Title</label>
						<input id="title" name="title" type="text" bind:value={title}
							class="input" placeholder="e.g. Fire Safety Best Practices for Festival Performers" required />
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label for="category" class="label">Category</label>
							<select id="category" name="category" bind:value={category} class="input">
								{#each categories as cat}
									<option value={cat.value}>{cat.label}</option>
								{/each}
							</select>
						</div>
						<div>
							<label for="tags" class="label">Tags (comma-separated)</label>
							<input id="tags" name="tags" type="text" bind:value={tags}
								class="input" placeholder="fire safety, festivals, tips" />
						</div>
					</div>

					<div>
						<label for="excerpt" class="label">Excerpt (optional)</label>
						<textarea id="excerpt" name="excerpt" bind:value={excerpt}
							class="input" rows="2" placeholder="Brief summary of your article..." maxlength="500"></textarea>
						<p class="text-xs text-gray-500 mt-1">If left empty, the first 200 characters of your content will be used.</p>
					</div>

					<div>
						<label for="coverImageUrl" class="label">Cover Image URL (optional)</label>
						<input id="coverImageUrl" name="coverImageUrl" type="url" bind:value={coverImageUrl}
							class="input" placeholder="https://..." />
						{#if coverImageUrl}
							<div class="mt-2 rounded-lg overflow-hidden border border-gray-200">
								<img src={coverImageUrl} alt="Cover preview" class="w-full h-32 object-cover" />
							</div>
						{/if}
					</div>

					<div>
						<div class="flex items-center justify-between mb-1">
							<label for="content" class="label">Article Content</label>
							<span class="text-xs text-gray-400">{wordCount} words | ~{readingTime} min read</span>
						</div>
						<textarea id="content" name="content" bind:value={content}
							class="input font-mono text-sm" rows="20" placeholder="Write your article here... Use plain text or basic HTML for formatting." required></textarea>
						<p class="text-xs text-gray-500 mt-1">Minimum 50 characters. You can use basic HTML for formatting (headings, bold, lists, links, etc.).</p>
					</div>
				</div>

				<div class="mt-6 flex items-center justify-between">
					<a href="/blog" class="btn-outline px-6 py-2.5">Cancel</a>
					<button type="submit" class="btn-primary px-8 py-2.5" disabled={submitting}>
						{submitting ? 'Publishing...' : 'Publish Article'}
					</button>
				</div>
			</form>
		{/if}
	</div>
</div>
