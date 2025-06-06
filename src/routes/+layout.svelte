<script lang="ts">
        import { page } from '$app/state';
        import { globalStore } from 'store';
        import Navigation from 'components/navigation/index.svelte';
	import Header from './Header.svelte';
	import '../app.css';

	let { children, data } = $props();

        // set logged in user
        globalStore.set({ ...$globalStore, user: data.user });
</script>

<div class="col h-full">
        <Navigation path={page.url.pathname} />

	<main class="flex-1 overflow-y-auto">
		{@render children()}
	</main>
</div>

