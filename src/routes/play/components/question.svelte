<script lang="ts">
	import { Icon, CheckCircle, XCircle } from 'svelte-hero-icons';
	import { decodeHTMLEntities } from 'utils';
	import { playStore, questionStore } from 'store';
	import Transition from 'svelte-transition';
	import QuestionControls from './questionControls.svelte';
	import Timer from './timerCountdown.svelte';
	import type { TQuestionAttributes } from 'models';

	interface Props {
		index: number;
		question: TQuestionAttributes;
	}
	let { index, question: _question }: Props = $props();

	const { answers: _answers, category, difficulty, id } = _question;
	const answers = _answers.map((entity) => decodeHTMLEntities(entity));
	const correctAnswer = decodeHTMLEntities(_question.correctAnswer);
	const question = decodeHTMLEntities(_question.question);
	const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
	const team: Record<string, string> = { easy: 'text-easy', medium: 'text-medium', hard: 'text-hard' };

	const timer = $derived(questionStore.timers[index]);
	const ended = $derived(timer.state === 'ended');

	const updateUserStats = () => {
		const isEasy = difficulty === 'easy';
		const isMedium = difficulty === 'medium';
		const isHard = difficulty === 'hard';
		const answeredCorrect = questionStore.timers[index].userAnswer === correctAnswer;

		// create new stat entry
		if (!playStore.userStats[category]) {
			playStore.userStats[category] = {
				category,
				total: 1,
				totalCorrect: answeredCorrect ? 1 : 0,
				totalEasy: isEasy ? 1 : 0,
				totalEasyCorrect: isEasy && answeredCorrect ? 1 : 0,
				totalMedium: isMedium ? 1 : 0,
				totalMediumCorrect: isMedium && answeredCorrect ? 1 : 0,
				totalHard: isHard ? 1 : 0,
				totalHardCorrect: isHard && answeredCorrect ? 1 : 0
			};
		} else {
			// update existing entry
			const {
				totalCorrect,
				total,
				totalEasy,
				totalEasyCorrect,
				totalMedium,
				totalMediumCorrect,
				totalHard,
				totalHardCorrect,
				...categoryStat
			} = playStore.userStats[category];

			playStore.userStats[category] = {
				...categoryStat,
				total: total + 1,
				totalCorrect: totalCorrect + (answeredCorrect ? 1 : 0),
				totalEasy: totalEasy + (isEasy ? 1 : 0),
				totalEasyCorrect: totalEasyCorrect + (answeredCorrect && isEasy ? 1 : 0),
				totalMedium: totalMedium + (isMedium ? 1 : 0),
				totalMediumCorrect: totalMediumCorrect + (isMedium && answeredCorrect ? 1 : 0),
				totalHard: totalHard + (isHard ? 1 : 0),
				totalHardCorrect: totalHardCorrect + (isHard && answeredCorrect ? 1 : 0)
			};
		}
	};

	const handleUserAnswer = (answer: string) => {
		questionStore.timers[index].userAnswer = answer;
		questionStore.timers[index].state = 'ended';
		updateUserStats();
		playStore.answeredQuestions.push(id);

		const correct = answer === correctAnswer;
		if (correct) playStore.totalCorrect++;

		const audio = document.getElementById(correct ? 'success' : 'error') as HTMLAudioElement;
		audio.play().catch(() => {});
	};
</script>

<Transition
	show={playStore.questionIndex === index}
	enter="transform transition duration-500 ease-out delay-150"
	enterFrom="opacity-0 translate-y-4"
	enterTo="opacity-100 translate-y-0"
	leave="transform duration-150 transition ease-in"
	leaveFrom="opacity-100"
	leaveTo="opacity-0"
>
	<div class="col w-full gap-6">
		<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
			<p class="label">
				{category} · <span class={team[difficulty]}>{difficulty}</span>
			</p>
			<p class="label">
				Question <span class="digits text-lg">{String(playStore.globalIndex).padStart(2, '0')}</span>
				/ {String(playStore.totalQuestions).padStart(2, '0')}
			</p>
		</div>

		<div class="col items-center gap-6">
			<Timer {index} />
			<p class="max-w-[38ch] text-balance text-center text-xl font-semibold leading-snug">
				{question}
			</p>
		</div>

		<section aria-label="Answers" class="grid grid-cols-1 gap-3 md:grid-cols-2">
			{#each answers as answer, i}
				{@const isCorrect = answer === correctAnswer}
				{@const chosen = timer.userAnswer === answer}
				<button
					onclick={() => handleUserAnswer(answer)}
					id={answer}
					disabled={timer.state !== 'started'}
					data-testid={answer}
					class={[
						'group flex min-h-16 items-center gap-4 rounded border-2 px-4 py-3 text-left text-lg transition-colors',
						!ended && 'border-line bg-panel hover:border-amber hover:bg-raised disabled:opacity-60',
						ended && isCorrect && 'border-easy bg-easy/10',
						ended && isCorrect && chosen && 'answer-correct',
						ended && chosen && !isCorrect && 'answer-wrong border-hard bg-hard/10',
						ended && !isCorrect && !chosen && 'border-line bg-panel opacity-45'
					]}
				>
					<span
						class={[
							'grid size-9 shrink-0 place-items-center rounded bg-ink font-display text-xl font-extrabold',
							!ended && 'text-muted group-hover:text-amber',
							ended && isCorrect && 'text-easy',
							ended && chosen && !isCorrect && 'text-hard'
						]}
						aria-hidden="true"
					>
						{letters[i]}
					</span>
					<span class="flex-1">{answer}</span>
					{#if ended && (isCorrect || chosen)}
						<span
							class={isCorrect ? 'text-easy' : 'text-hard'}
							data-testid={`feedback-${isCorrect ? 'correct' : 'incorrect'}-${i}`}
						>
							<Icon src={isCorrect ? CheckCircle : XCircle} size="24" />
							<span class="sr-only">{isCorrect ? 'Correct answer' : 'Your answer, incorrect'}</span>
						</span>
					{/if}
				</button>
			{/each}
		</section>

		{#if ended && !timer.userAnswer}
			<p class="text-center font-display text-lg font-bold uppercase tracking-wider text-hard" role="status">
				Shot clock violation, out of time
			</p>
		{/if}

		<QuestionControls {index} />

		<audio id="success" preload="auto">
			<source src="/success.mp3" type="audio/mpeg" />
		</audio>
		<audio id="error" preload="auto">
			<source src="/error.mp3" type="audio/mpeg" />
		</audio>
	</div>
</Transition>
