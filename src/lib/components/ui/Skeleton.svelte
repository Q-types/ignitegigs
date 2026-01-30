<script lang="ts">
	let {
		class: className = '',
		width = '100%',
		height = '1rem',
		rounded = 'rounded'
	}: {
		class?: string;
		width?: string;
		height?: string;
		rounded?: string;
	} = $props();
</script>

<div
	class="animate-pulse bg-gray-200 {rounded} {className}"
	style="width: {width}; height: {height};"
></div>
