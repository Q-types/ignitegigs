<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import { ShareButtons } from '$lib/components/ui';
	import JsonLd from '$lib/components/JsonLd.svelte';

	let { data } = $props();

	let commentContent = $state('');
	let replyingTo = $state<string | null>(null);
	let replyContent = $state('');
	let submittingComment = $state(false);

	function formatDate(date: string): string {
		return new Date(date).toLocaleDateString('en-GB', {
			day: 'numeric', month: 'long', year: 'numeric'
		});
	}

	function formatCommentDate(date: string): string {
		const now = new Date();
		const then = new Date(date);
		const diffMs = now.getTime() - then.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return formatDate(date);
	}

	let readingTime = $derived((() => {
		if (!data.post.content) return '1 min read';
		const words = data.post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
		const mins = Math.max(1, Math.ceil(words / 200));
		return `${mins} min read`;
	})());

	let articleSchema = $derived(
		Object.fromEntries(
			Object.entries({
				'@context': 'https://schema.org',
				'@type': 'Article',
				headline: data.post.title,
				description: data.post.excerpt,
				image: data.post.cover_image_url,
				datePublished: data.post.published_at,
				author: {
					'@type': 'Organization',
					name: 'IgniteGigs'
				},
				publisher: {
					'@type': 'Organization',
					name: 'IgniteGigs',
					logo: {
						'@type': 'ImageObject',
						url: 'https://ignitegigs.com/logo.png'
					}
				}
			}).filter(([, v]) => v !== undefined)
		) as Record<string, unknown>
	);
</script>

<svelte:head>
	<title>{data.post.title} - IgniteGigs Blog</title>
	<meta name="description" content={data.post.excerpt || data.post.title} />
	{#if data.post.cover_image_url}
		<meta property="og:image" content={data.post.cover_image_url} />
	{/if}
</svelte:head>

<JsonLd schema={articleSchema} />

<div class="min-h-screen bg-gray-50">
	<!-- Article Header -->
	<div class="bg-white border-b border-gray-200">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<!-- Back link -->
			<a href="/blog" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Back to Blog
			</a>

			<!-- Category Badge -->
			<span class="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4 capitalize">
				{data.post.category}
			</span>

			<!-- Title -->
			<h1 class="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
				{data.post.title}
			</h1>

			<!-- Author & Meta -->
			<div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
				<div class="flex items-center gap-3">
					{#if data.post.author?.avatar_url}
						<img src={data.post.author.avatar_url} alt="" class="w-10 h-10 rounded-full" />
					{:else}
						<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
							<span class="text-sm text-primary font-semibold">{data.post.author?.full_name?.charAt(0) || '?'}</span>
						</div>
					{/if}
					<div>
						<p class="font-medium text-gray-900">{data.post.author?.full_name || 'Anonymous'}</p>
						<p class="text-gray-500">
							{data.post.published_at ? formatDate(data.post.published_at) : 'Draft'}
						</p>
					</div>
				</div>

				<span class="text-gray-300">|</span>
				<span>{readingTime}</span>
				<span class="text-gray-300">|</span>
				<span class="flex items-center gap-1">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
					</svg>
					{data.post.view_count || 0} views
				</span>

				<!-- Share Buttons -->
				<div class="ml-auto">
					<ShareButtons
						url={$page.url.href}
						title={data.post.title}
						description={data.post.excerpt || data.post.title}
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- Cover Image -->
	{#if data.post.cover_image_url}
		<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mb-8 relative z-10">
			<div class="mt-8 rounded-xl overflow-hidden shadow-lg">
				<img
					src={data.post.cover_image_url}
					alt={data.post.title}
					class="w-full aspect-video object-cover"
				/>
			</div>
		</div>
	{/if}

	<!-- Article Content -->
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<article class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10">
			<div class="prose prose-lg prose-gray max-w-none
				prose-headings:font-display prose-headings:text-gray-900
				prose-a:text-primary prose-a:no-underline hover:prose-a:underline
				prose-img:rounded-lg
				prose-strong:text-gray-900
				prose-code:text-primary prose-code:bg-primary/5 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5
				prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1">
				{@html data.post.content}
			</div>
		</article>

		<!-- Tags -->
		{#if data.post.tags && data.post.tags.length > 0}
			<div class="mt-6 flex flex-wrap items-center gap-2">
				<span class="text-sm text-gray-500">Tags:</span>
				{#each data.post.tags as tag}
					<a
						href="/blog?category={tag}"
						class="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
					>
						{tag}
					</a>
				{/each}
			</div>
		{/if}

		<!-- Share This Article -->
		<div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<h3 class="font-display text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
			<ShareButtons
				url={$page.url.href}
				title={data.post.title}
				description={data.post.excerpt || data.post.title}
			/>
		</div>

		<!-- Author Card -->
		<div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex items-start gap-4">
				{#if data.post.author?.avatar_url}
					<img src={data.post.author.avatar_url} alt="" class="w-14 h-14 rounded-full flex-shrink-0" />
				{:else}
					<div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
						<span class="text-lg text-primary font-semibold">{data.post.author?.full_name?.charAt(0) || '?'}</span>
					</div>
				{/if}
				<div>
					<p class="font-display font-semibold text-gray-900 text-lg">{data.post.author?.full_name || 'Anonymous'}</p>
					<p class="text-sm text-gray-500 mt-1">Community contributor on IgniteGigs</p>
				</div>
			</div>
		</div>

		<!-- Comments Section -->
		<div class="mt-12">
			<h2 class="font-display text-xl font-bold text-gray-900 mb-6">
				Comments ({data.comments.length})
			</h2>

			<!-- Comment Form -->
			{#if data.post.status === 'published'}
				<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
					<form
						method="POST"
						action="?/comment"
						use:enhance={() => {
							submittingComment = true;
							return async ({ result, update }) => {
								submittingComment = false;
								if (result.type === 'success') {
									commentContent = '';
									await invalidateAll();
								}
								await update();
							};
						}}
					>
						<label for="comment-input" class="label">Leave a comment</label>
						<textarea
							id="comment-input"
							name="content"
							bind:value={commentContent}
							class="input"
							rows="3"
							placeholder="Share your thoughts..."
							maxlength="2000"
							required
						></textarea>
						<div class="flex items-center justify-between mt-3">
							<span class="text-xs text-gray-400">{commentContent.length}/2000</span>
							<button
								type="submit"
								class="btn-primary px-5 py-2 text-sm"
								disabled={submittingComment || !commentContent.trim()}
							>
								{submittingComment ? 'Posting...' : 'Post Comment'}
							</button>
						</div>
					</form>
				</div>
			{/if}

			{#if $page.form?.error}
				<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
					{$page.form.error}
				</div>
			{/if}

			<!-- Comments List -->
			{#if data.comments.length > 0}
				<div class="space-y-6">
					{#each data.comments as comment}
						<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
							<div class="flex items-start gap-3">
								{#if comment.author?.avatar_url}
									<img src={comment.author.avatar_url} alt="" class="w-8 h-8 rounded-full flex-shrink-0" />
								{:else}
									<div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
										<span class="text-xs text-primary font-medium">{comment.author?.full_name?.charAt(0) || '?'}</span>
									</div>
								{/if}
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-2 mb-1">
										<span class="font-medium text-sm text-gray-900">{comment.author?.full_name || 'Anonymous'}</span>
										<span class="text-xs text-gray-400">{formatCommentDate(comment.created_at)}</span>
									</div>
									<p class="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>

									<button
										class="mt-2 text-xs text-gray-400 hover:text-primary transition-colors"
										onclick={() => { replyingTo = replyingTo === comment.id ? null : comment.id; replyContent = ''; }}
									>
										Reply
									</button>

									<!-- Reply Form -->
									{#if replyingTo === comment.id}
										<form
											method="POST"
											action="?/comment"
											class="mt-3"
											use:enhance={() => {
												submittingComment = true;
												return async ({ result, update }) => {
													submittingComment = false;
													if (result.type === 'success') {
														replyingTo = null;
														replyContent = '';
														await invalidateAll();
													}
													await update();
												};
											}}
										>
											<input type="hidden" name="parentId" value={comment.id} />
											<textarea
												name="content"
												bind:value={replyContent}
												class="input text-sm"
												rows="2"
												placeholder="Write a reply..."
												maxlength="2000"
												required
											></textarea>
											<div class="flex items-center gap-2 mt-2">
												<button type="submit" class="btn-primary px-4 py-1.5 text-xs" disabled={submittingComment || !replyContent.trim()}>
													{submittingComment ? 'Posting...' : 'Reply'}
												</button>
												<button type="button" class="text-xs text-gray-400 hover:text-gray-600" onclick={() => { replyingTo = null; }}>
													Cancel
												</button>
											</div>
										</form>
									{/if}

									<!-- Replies -->
									{#if comment.replies && comment.replies.length > 0}
										<div class="mt-4 space-y-4 pl-4 border-l-2 border-gray-100">
											{#each comment.replies as reply}
												<div class="flex items-start gap-3">
													{#if reply.author?.avatar_url}
														<img src={reply.author.avatar_url} alt="" class="w-6 h-6 rounded-full flex-shrink-0" />
													{:else}
														<div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
															<span class="text-[10px] text-primary font-medium">{reply.author?.full_name?.charAt(0) || '?'}</span>
														</div>
													{/if}
													<div class="flex-1 min-w-0">
														<div class="flex items-center gap-2 mb-1">
															<span class="font-medium text-xs text-gray-900">{reply.author?.full_name || 'Anonymous'}</span>
															<span class="text-xs text-gray-400">{formatCommentDate(reply.created_at)}</span>
														</div>
														<p class="text-sm text-gray-700 whitespace-pre-wrap">{reply.content}</p>
													</div>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="text-center py-10 bg-white rounded-xl border border-gray-200">
					<svg class="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
					</svg>
					<p class="text-sm text-gray-500">No comments yet. Be the first to share your thoughts!</p>
				</div>
			{/if}
		</div>
	</div>
</div>
