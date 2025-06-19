<script>
	import { globalStore, questionStore, playStore } from 'store';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { Button, SpinningLoader } from 'components';

	let { index } = $props();
	let updating = $state(false);
	let loadingContext = $state('');
	const isLastQuestion = playStore.globalIndex === playStore.totalQuestions;
	const moreQuestions = !(index % 4) && index > 0;

	const submitStats = (context) => {
		loadingContext = context;
		updating = true;
		return async ({ result }) => {
			if (isLastQuestion) {
				goto('/stats');
			} else {
				questionStore.timers = Array.from(result.data.questions, (_, i) => ({
					state: !i ? 'started' : '',
					userAnswer: '',
					timer: null
				}));
				playStore.questions = result.data.questions;
				updating = false;
				playStore.questionIndex = 0;
				playStore.globalIndex++;
				playStore.userStats = {};
				playStore.answeredQuestions = [];
			}
		};
	};
</script>

{#snippet submitForm(context)}
	<form class="w-full" use:enhance={() => submitStats(context)} action="?/paginate" method="POST">
		<input type="hidden" bind:value={playStore.totalCorrect} name="totalCorrect" />
		<input type="hidden" bind:value={() => globalStore.difficulty, null} name="difficulty" />
		<input
			type="hidden"
			bind:value={() => globalStore.categories.join(','), null}
			name="categories"
		/>
		<input
			type="hidden"
			bind:value={() => JSON.stringify(playStore.answeredQuestions), null}
			name="answeredQuestions"
		/>
		<input
			type="hidden"
			bind:value={() => JSON.stringify(playStore.userStats), null}
			name="stats"
		/>
		<input type="hidden" bind:value={globalStore.user.username} name="username" />
		<Button class="w-full" disabled={updating}>
			{#if updating && context === loadingContext}
				Uploading results <SpinningLoader size="8" />
			{:else if context === 'later'}
				View progress
			{:else}
				Continue Playing
			{/if}
		</Button>
	</form>
{/snippet}

<div class="col gap-2">
	{#if questionStore.timers[index].state === 'started'}
		<Button
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
		{@render submitForm('later')}
	{/if}

	{#if questionStore.timers[index].state === 'ended' && !isLastQuestion}
		{#if moreQuestions}
			{@render submitForm('next')}
		{:else}
			<Button
				onclick={() => {
					playStore.questionIndex++;
					questionStore.timers[index + 1].state = 'started';
					playStore.globalIndex++;
				}}
			>
				Next Question
			</Button>
		{/if}
	{/if}
</div>
