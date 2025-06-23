<script lang="ts">
	import { globalStore } from 'store';
	import Navigation from 'components/navigation/index.svelte';
	import '../app.css';

	let { children, data } = $props();

	// set logged in user
        if (!globalStore.user)
                globalStore.user = data.user;
</script>

<div class="col h-full">
	<Navigation />

	<main class="flex-1 overflow-y-auto">
		{@render children()}
	</main>
</div>

