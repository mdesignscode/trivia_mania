<script lang="ts">
	import { playStore, questionStore, globalStore } from 'store';
	import Question from './components/question.svelte';
	import { page } from '$app/state';
	import { Button } from 'components';
	import type { TQuestionAttributes } from 'models';

	interface Props {
		data: {
			questions: TQuestionAttributes[];
			total: number;
		};
	}

	globalStore.categories = (page.url.searchParams.get('categories') || 'All Categories').split(',');
	globalStore.difficulty = page.url.searchParams.get('difficulty') || 'all difficulties';

	let { data }: Props = $props();
	let ready = $state(false);

	playStore.questions = data.questions;
	playStore.totalQuestions = data.total;
	questionStore.timers = Array.from(data.questions, () => ({
		state: null,
		userAnswer: '',
		timer: null
	}));
</script>

<svelte:head>
	<title>Quiz Time</title>
	<meta name="description" content="Answer questions based on your selected filters" />
</svelte:head>

{#if !data.total}
	<div class="col h-full w-full items-center justify-center">
		<h1>All questions answered for filter:</h1>

		<div class="px-2">
			<p class="text-accent-100">
				<span class="text-gray-500">Categories:</span>
				{globalStore.categories.join(',')}
			</p>
			<p class="text-accent-100">
				<span class="text-gray-500">Difficulty:</span>
				{globalStore.difficulty}
			</p>
		</div>
	</div>
{:else if ready}
	<div class="col items-center gap-4 p-4">
		<h2 class="text-xl font-bold">
			Question {playStore.globalIndex} of {data.total}
		</h2>
		{#each playStore.questions as question, index}
			{#if index === playStore.questionIndex}
				<Question {question} {index} />
			{/if}
		{/each}
	</div>
{:else}
	<div class="col h-full w-full items-center justify-center gap-2">
		<div class="flex gap-4">
			<div class="flex flex-col font-bold">
				<span>Difficulty:</span>
				<span>Categories:</span>
				<span>Total Questions:</span>
			</div>
			<div class="flex flex-col">
				<span>{globalStore.difficulty}</span>
				<span>{globalStore.categories.join(', ')}</span>
				<span>{playStore.totalQuestions}</span>
			</div>
		</div>

		<div class="mt-2 flex justify-between gap-4">
			<Button
				onclick={() => {
					ready = true;
					questionStore.timers[0].state = 'started';
				}}
				play
			>
				Start playing
			</Button>
			<a href="/">
				<Button>Change filters</Button>
			</a>
		</div>
	</div>
{/if}

