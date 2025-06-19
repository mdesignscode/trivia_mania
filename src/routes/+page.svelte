<script lang="ts">
	import Home from 'components/home/index.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Trivia Mania home page" />
</svelte:head>

<Home allCategories={data.allCategories} allDifficulties={data.allDifficulties} />
