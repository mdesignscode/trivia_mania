<script lang="ts">
	import SpinningLoader from 'components/spinningLoader.svelte';
	import Button from 'components/button.svelte';
	import { globalStore } from 'store';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let { allDifficulties, allCategories } = $props();
	let loading = $state(false);
	let filteredCategories = $state([]);

	if (browser) {
		const localDifficulty = localStorage.getItem('difficulty') || '';
		const localSelectedCategories = localStorage.getItem('selectedCategories') || '';
		const selectedCategories = localSelectedCategories ? localSelectedCategories.split(',') : [];
		const availableCategories = [];

		// check availability of category
		selectedCategories.forEach((c) => {
			if (allCategories[c] && allCategories[c][localDifficulty]) {
				availableCategories.push(c);
			}
		});

		// update local storage with available categories
		if (selectedCategories.some((c) => !availableCategories.includes(c)))
			localStorage.setItem('selectedCategories', availableCategories.join(','));

		globalStore.difficulty = localDifficulty;
		globalStore.categories = availableCategories;

		if (localDifficulty) {
			filteredCategories = Object.values(allCategories)
				.map((value) => value[localDifficulty])
				.filter(Boolean);
		}
	}

	const handleSelectCategory = (category: string) => {
		let selectedCategories = globalStore.categories.includes(category)
			? globalStore.categories.filter((cat) => cat !== category)
			: [...globalStore.categories, category];
		if (category === 'All Categories') {
			if (!globalStore.categories.includes(category)) selectedCategories = [category];
		} else {
			if (globalStore.categories.includes('All Categories'))
				selectedCategories = selectedCategories.filter((cat) => cat !== 'All Categories');
		}
		globalStore.categories = selectedCategories;
	};

	const handleSetDifficulty = (difficulty) => {
		if (difficulty && typeof difficulty === 'string') {
			globalStore.difficulty = difficulty;
			localStorage.setItem('difficulty', difficulty);
		}
		filteredCategories = Object.values(allCategories)
			.map((value) => value[globalStore.difficulty])
			.filter(Boolean);
	};

	const handlePlay = () => {
		const playUri = encodeURI(
			`/play?difficulty=${globalStore.difficulty}&categories=${globalStore.categories.join(',')}`
		);
		localStorage.setItem('difficulty', globalStore.difficulty);
		localStorage.setItem('selectedCategories', globalStore.categories.join(','));
		goto(playUri);
	};
</script>

{#snippet difficultiesBox()}
	<div class="flex gap-2">
		{#each [...allDifficulties, 'all difficulties'] as diff}
			<Button
				onclick={filteredCategories.length
					? () => handleSetDifficulty(diff)
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

			<Button disabled={!globalStore.difficulty || loading} onclick={handleSetDifficulty}>
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
				<Button play disabled={!globalStore.categories.length} onclick={handlePlay}>
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
