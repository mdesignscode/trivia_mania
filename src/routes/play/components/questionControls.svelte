<script lang="ts">
	import { globalStore, questionStore, playStore } from 'store';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { Button, SpinningLoader } from 'components';
	import type { TPaginateSuccess } from '../+page.server';
	import type { ActionResult } from '@sveltejs/kit';
	import type { $ZodIssue } from 'zod/v4/core';

	type TPaginateResult = ActionResult<TPaginateSuccess, { error: string; issues: $ZodIssue[] }>;
	interface Props {
		index: number;
	}

	let { index }: Props = $props();
	let updating = $state(false);
	let loadingContext: 'show stats' | 'next question' | null = $state(null);

	const isLastQuestion = playStore.globalIndex === playStore.totalQuestions;
	const moreQuestions = !(index % 4) && index > 0;

	const submitStats = (context: typeof loadingContext) => {
		loadingContext = context;
		updating = true;

		return async ({ result }: { result: TPaginateResult }) => {
			if (result.type === 'success' && result.data) {
				const { questions } = result.data;

				if (isLastQuestion) {
					localStorage.removeItem('difficulty');
					localStorage.removeItem('categories');
					goto('/stats');
				} else {
					playStore.questionIndex = 0;
					playStore.userStats = {};
					playStore.answeredQuestions = [];
					playStore.totalCorrect = 0;

					if (context === 'show stats') {
						playStore.globalIndex = 1;
						playStore.questions = [];
						questionStore.timers = [];
						goto('/stats');
					} else {
						playStore.globalIndex++;
						playStore.questions = questions;
						questionStore.timers = Array.from(questions, (_, i) => ({
							state: !i ? 'started' : null,
							userAnswer: '',
							timer: null
						}));
						updating = false;
					}
				}
			} else if (result.type === 'failure') {
				// failure payload is exactly { error, issues }
				console.error(result.data?.error, result.data?.issues);
				updating = false;
			}
		};
	};
</script>

{#snippet submitForm(context: typeof loadingContext)}
	<form class="flex-1" use:enhance={() => submitStats(context)} action="?/paginate" method="POST">
		<input type="hidden" bind:value={playStore.totalCorrect} name="totalCorrect" />
		<input type="hidden" bind:value={() => globalStore.difficulty, () => {}} name="difficulty" />
		<input
			type="hidden"
			bind:value={() => globalStore.categories.join(','), () => {}}
			name="categories"
		/>
		<input
			type="hidden"
			bind:value={() => JSON.stringify(playStore.answeredQuestions), () => {}}
			name="answeredQuestions"
		/>
		<input
			type="hidden"
			bind:value={() => JSON.stringify(playStore.userStats), () => {}}
			name="stats"
		/>
		<input type="hidden" bind:value={globalStore.user.username} name="username" />
		<Button class="w-full" primary={context === 'next question'} disabled={updating}>
			{#if updating && context === loadingContext}
				Saving results <SpinningLoader size="5" />
			{:else if context === 'show stats'}
				View progress
			{:else}
				Next set
			{/if}
		</Button>
	</form>
{/snippet}

<div class="flex flex-col-reverse gap-3 sm:flex-row">
	{#if questionStore.timers[index].state === 'started'}
		<Button
			class="sm:ml-auto"
			onclick={() => {
				clearInterval(questionStore.timers[index].timer);
				questionStore.timers[index].timer = null;
				questionStore.timers[index].state = 'continue later';
				goto('/stats');
			}}
		>
			Continue later
		</Button>
	{:else}
		{@render submitForm('show stats')}
	{/if}

	{#if questionStore.timers[index].state === 'ended' && !isLastQuestion}
		{#if moreQuestions}
			{@render submitForm('next question')}
		{:else}
			<Button
				primary
				class="flex-1"
				onclick={() => {
					playStore.questionIndex++;
					questionStore.timers[index + 1].state = 'started';
					playStore.globalIndex++;
				}}
			>
				Next question
			</Button>
		{/if}
	{/if}
</div>

