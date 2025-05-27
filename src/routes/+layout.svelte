<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="col h-full">
	<Header />

	<main class="flex-1">
		{@render children()}
	</main>
</div>

