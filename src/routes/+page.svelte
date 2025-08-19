<script lang="ts">
        import { goto } from '$app/navigation';
	import SpinningLoader from 'components/spinningLoader.svelte';
	import Button from 'components/button.svelte';
	import { globalStore } from 'store';
	import { browser } from '$app/environment';
	import {
		handlePlay,
		handleSelectCategory,
		handleSetDifficulty,
		updateLocalPreferences
	} from 'utils/uiHelpers.svelte';
	import type { TProcessResult, TQuestionData } from 'utils/processCategories.js';

	let { data }: { data: TProcessResult } = $props();
	const { allCategories, allDifficulties } = data;

	let loading = $state(false);
	let filteredCategories: TQuestionData[] = $state([]);

	if (browser) {
		const localFilteredCategories = updateLocalPreferences(allCategories, localStorage);
		if (localFilteredCategories) filteredCategories = localFilteredCategories;
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Trivia Mania home page" />
</svelte:head>

{#snippet difficultiesBox()}
	<div class="flex gap-2">
		{#each [...allDifficulties, 'all difficulties'] as diff}
			<Button
				onclick={filteredCategories.length
					? () => (filteredCategories = handleSetDifficulty(localStorage, allCategories, diff))
					: () => (globalStore.difficulty = diff)}
				class={[
					diff === globalStore.difficulty && 'primary',
					filteredCategories.length && 'show-categories'
				]}
			>
				{diff}
			</Button>
		{/each}
	</div>
{/snippet}

<section class="h-full">
	{#if !filteredCategories.length}
		<div class="col h-full items-center justify-center gap-3">
			<p>Choose a difficulty to continue</p>

			{@render difficultiesBox()}

			<Button
				disabled={!globalStore.difficulty || loading}
				onclick={() => (filteredCategories = handleSetDifficulty(localStorage, allCategories))}
			>
				Continue
				{#if loading}
					<SpinningLoader size="8" />
				{/if}
			</Button>
		</div>
	{:else}
		<div class="col h-full overflow-y-hidden">
			<div class="grid place-content-center gap-2 rounded-b-xl bg-accent py-6">
				{@render difficultiesBox()}
				<Button
					play
					disabled={!globalStore.categories.length}
					onclick={() => handlePlay(localStorage, goto)}
				>
					{#if globalStore.categories.length}
						Play
					{:else}
						Pick categories
					{/if}
				</Button>
			</div>

			<div
				class="col flex-1 items-center gap-4 overflow-y-auto px-2 py-4 md:mx-auto md:w-4/6 md:pt-8"
			>
				<div class="flex flex-wrap justify-center gap-2">
					{#each filteredCategories as { category, count }}
						<Button
							onclick={() => handleSelectCategory(category)}
							class={globalStore.categories.includes(category) ? 'primary' : ''}
							>{category} ({count})</Button
						>
					{/each}
				</div>

				<Button
					onclick={() => (globalStore.categories = [])}
					disabled={!globalStore.categories.length}
				>
					Reset categories
				</Button>
			</div>
		</div>
	{/if}
</section>

