<script lang="ts">
	import { playStore, questionStore, globalStore } from 'store';
	import Question from './components/question.svelte';
	import { page } from '$app/state';
	import { Button } from 'components';
	import { Icon, Play } from 'svelte-hero-icons';
	import { decodeHTMLEntities } from 'utils';
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

	const team: Record<string, string> = { easy: 'text-easy', medium: 'text-medium', hard: 'text-hard' };

	// one pip per question in the current set
	const pips = $derived(
		questionStore.timers.map((t, i) => {
			if (t.state !== 'ended') return i === playStore.questionIndex ? 'current' : 'pending';
			const correct = playStore.questions[i]?.correctAnswer;
			return t.userAnswer && correct && t.userAnswer === decodeHTMLEntities(correct) ? 'hit' : 'miss';
		})
	);
</script>

<svelte:head>
	<title>Play · Trivia Mania</title>
	<meta name="description" content="Answer questions based on your selected filters" />
</svelte:head>

{#snippet matchup()}
	<dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-left">
		<dt class="label pt-1">Difficulty</dt>
		<dd class={['font-display text-xl font-bold uppercase', team[globalStore.difficulty] ?? 'text-chalk']}>
			{globalStore.difficulty}
		</dd>
		<dt class="label pt-1">Categories</dt>
		<dd class="font-medium">{globalStore.categories.join(', ')}</dd>
	</dl>
{/snippet}

{#if !data.total}
	<section class="mx-auto flex min-h-full max-w-xl flex-col justify-center gap-6 px-4 py-10">
		<h1 class="text-3xl leading-none">You've answered them all</h1>
		<p class="text-muted">There are no questions left for this pick. Try another difficulty or more categories.</p>
		<div class="panel p-5">{@render matchup()}</div>
		<a href="/" class="link self-start">Change your pick</a>
	</section>
{:else if ready}
	<section class="mx-auto flex min-h-full max-w-3xl flex-col gap-6 px-4 py-6 md:py-10">
		{#each playStore.questions as question, index}
			{#if index === playStore.questionIndex}
				<Question {question} {index} />
			{/if}
		{/each}

		<div class="mt-auto flex items-center justify-center gap-2 pt-4" aria-label="This set">
			<span class="label mr-2">This set</span>
			{#each pips as pip}
				<span
					class={[
						'h-2.5 w-8 rounded-sm',
						pip === 'hit' && 'bg-easy',
						pip === 'miss' && 'bg-hard',
						pip === 'current' && 'bg-amber',
						pip === 'pending' && 'bg-line'
					]}
					title={pip}
				></span>
			{/each}
		</div>
	</section>
{:else}
	<section class="mx-auto flex min-h-full max-w-xl flex-col justify-center gap-8 px-4 py-10">
		<div class="col gap-2">
			<p class="digits text-4xl leading-none">{String(playStore.totalQuestions).padStart(2, '0')}</p>
			<h1 class="text-3xl leading-none">Questions ready</h1>
			<p class="text-muted">30 seconds on the clock for each. The clock starts when you do.</p>
		</div>

		<div class="panel p-5">{@render matchup()}</div>

		<div class="flex flex-wrap items-center gap-4">
			<Button
				play
				onclick={() => {
					ready = true;
					questionStore.timers[0].state = 'started';
				}}
			>
				<Icon src={Play} size="20" />
				Start playing
			</Button>
			<a href="/" class="link">Change pick</a>
		</div>
	</section>
{/if}
