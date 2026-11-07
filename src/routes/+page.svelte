<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from 'components/button.svelte';
	import { globalStore } from 'store';
	import { browser } from '$app/environment';
	import { Icon, Play } from 'svelte-hero-icons';
	import {
		handlePlay,
		handleSelectCategory,
		handleSetDifficulty,
		updateLocalPreferences
	} from 'utils/uiHelpers.svelte';
	import type { TProcessResult, TQuestionData } from 'utils/processFilters';

	let { data }: { data: TProcessResult } = $props();
	const { allCategories, allDifficulties } = data;

	const order = ['easy', 'medium', 'hard'];
	const difficulties = [
		...[...allDifficulties].sort((a, b) => order.indexOf(a) - order.indexOf(b)),
		'all difficulties'
	];
	const team: Record<string, string> = {
		easy: 'text-easy border-easy',
		medium: 'text-medium border-medium',
		hard: 'text-hard border-hard',
		'all difficulties': 'text-chalk border-chalk'
	};
	const blurb: Record<string, string> = {
		easy: 'Warm up',
		medium: 'Fair fight',
		hard: 'No mercy',
		'all difficulties': 'Mixed bag'
	};

	let filteredCategories: TQuestionData[] = $state([]);

	if (browser) {
		const localFilteredCategories = updateLocalPreferences(allCategories, localStorage);
		if (localFilteredCategories) filteredCategories = localFilteredCategories;
	}

	const chooseDifficulty = (diff: string) =>
		(filteredCategories = handleSetDifficulty(localStorage, allCategories, diff));

	const selectedCount = $derived(
		filteredCategories
			.filter(({ category }) => globalStore.categories.includes(category))
			.reduce((sum, { count }) => sum + count, 0)
	);
</script>

<svelte:head>
	<title>Trivia Mania</title>
	<meta name="description" content="Pick a difficulty and categories, then beat the shot clock." />
</svelte:head>

{#if !filteredCategories.length}
	<section class="mx-auto flex min-h-full max-w-5xl flex-col justify-center gap-8 px-4 py-10 md:px-8">
		<div class="col gap-2">
			<h1 class="text-3xl leading-none">Pick your difficulty</h1>
			<p class="text-muted">Every question runs on a 30-second shot clock.</p>
		</div>

		<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
			{#each difficulties as diff}
				<button
					onclick={() => chooseDifficulty(diff)}
					class={[
						'tile group col min-h-36 justify-between rounded border-2 border-line bg-panel p-4 text-left transition-colors hover:bg-raised md:min-h-48 md:p-5',
						diff === globalStore.difficulty && 'is-picked',
						team[diff]
					]}
				>
					<span class="label group-hover:text-chalk">{blurb[diff]}</span>
					<span class="font-display text-2xl font-extrabold uppercase leading-none md:text-3xl">
						{diff === 'all difficulties' ? 'All' : diff}
					</span>
				</button>
			{/each}
		</div>
	</section>
{:else}
	<section class="col min-h-full">
		<div class="border-b border-line bg-panel">
			<div class="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 md:flex-row md:items-end md:justify-between md:px-8">
				<div class="col gap-1">
					<h1 class="text-3xl leading-none">Pick your categories</h1>
					<p class="text-muted">Choose one or more. "All Categories" mixes everything.</p>
				</div>

				<div class="flex flex-wrap gap-1 rounded border border-line bg-ink p-1" role="group" aria-label="Difficulty">
					{#each difficulties as diff}
						<button
							onclick={() => chooseDifficulty(diff)}
							aria-pressed={diff === globalStore.difficulty}
							class={[
								'min-h-10 rounded px-3 font-display text-base font-bold uppercase tracking-wider transition-colors',
								diff === globalStore.difficulty
									? ['bg-raised', team[diff]]
									: 'text-muted hover:text-chalk'
							]}
						>
							{diff === 'all difficulties' ? 'All' : diff}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<div class="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-8">
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
				{#each [...filteredCategories].sort((a, b) => Number(b.category === 'All Categories') - Number(a.category === 'All Categories')) as { category, count }}
					{@const picked = globalStore.categories.includes(category)}
					<button
						onclick={() => handleSelectCategory(category)}
						aria-pressed={picked}
						class={[
							'flex min-h-14 items-center justify-between gap-3 rounded border px-4 py-2 text-left transition-colors',
							picked
								? 'border-amber bg-amber/10 text-chalk'
								: 'border-line bg-panel text-chalk/90 hover:border-muted/60 hover:bg-raised',
							category === 'All Categories' && 'sm:col-span-2 lg:col-span-3'
						]}
					>
						<span class={['font-medium', picked && 'font-semibold']}>{category}</span>
						<span class={['digits text-xl', !picked && 'text-muted']}>{count}</span>
					</button>
				{/each}
			</div>
		</div>

		<div class="sticky bottom-0 border-t border-line bg-ink/95 backdrop-blur">
			<div class="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 md:px-8">
				<p class="mr-auto text-sm text-muted md:text-base" aria-live="polite">
					{#if globalStore.categories.length}
						<span class="digits text-lg">{selectedCount}</span> questions in
						{globalStore.categories.length}
						{globalStore.categories.length === 1 ? 'category' : 'categories'}
					{:else}
						No categories picked yet
					{/if}
				</p>
				<button
					class="min-h-11 px-2 text-sm text-muted underline decoration-muted/40 hover:text-chalk disabled:invisible"
					onclick={() => (globalStore.categories = [])}
					disabled={!globalStore.categories.length}
				>
					Clear
				</button>
				<Button
					play
					disabled={!globalStore.categories.length}
					onclick={() => handlePlay(localStorage, goto)}
				>
					<Icon src={Play} size="20" />
					Play
				</Button>
			</div>
		</div>
	</section>
{/if}

<style>
	.tile.is-picked {
		border-color: currentColor;
	}
	.tile:hover {
		border-color: currentColor;
	}
</style>
