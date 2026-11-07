<script lang="ts">
	import { globalStore } from 'store';
	import Navigation from 'components/navigation/index.svelte';
	import '@fontsource/big-shoulders-display/600';
	import '@fontsource/big-shoulders-display/700';
	import '@fontsource/big-shoulders-display/800';
	import '@fontsource/barlow/400';
	import '@fontsource/barlow/500';
	import '@fontsource/barlow/600';
	import '../app.css';

	let { children, data } = $props();

	// set logged in user
	if (!globalStore.user) globalStore.user = data.user ?? null;
</script>

<div class="col h-full">
	<Navigation />

	<main class="flex-1 overflow-y-auto">
		{@render children()}
	</main>
</div>
