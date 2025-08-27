<script lang="ts">
	import { Icon, CheckCircle, XCircle } from 'svelte-hero-icons';
	import { decodeHTMLEntities } from 'utils';
	import { playStore, questionStore } from 'store';
	import { Button } from 'components';
	import Transition from 'svelte-transition';
	import QuestionControls from './questionControls.svelte';
	import Timer from './timerCountdown.svelte';
	import { colorMap } from 'utils';
	import type { TQuestionAttributes } from 'models';
	import type { IconSource } from 'svelte-hero-icons';

	interface Props {
		index: number;
		question: TQuestionAttributes;
	}
	let { index, question: _question }: Props = $props();

	let answerFeedback: (IconSource | null)[] = $state([null, null, null, null]);

	const { answers: _answers, category, correctAnswer, difficulty, question, id } = _question;
	const answers = _answers.map((entity) => decodeHTMLEntities(entity));

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

			const updatedStat = {
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

			playStore.userStats[category] = updatedStat;
		}
	};

	const handleUserAnswer = (answer: string, answerIndex: number) => {
		questionStore.timers[index].userAnswer = answer;
		questionStore.timers[index].state = 'ended';
		updateUserStats();
		playStore.answeredQuestions.push(id);
		console.debug({ playStore, questionStore });

		if (answer === correctAnswer) playStore.totalCorrect++;

		// display icon based on correct answer
		answerFeedback = answerFeedback.map((_, j) => {
			if (answerIndex === j) {
				return answer === correctAnswer ? CheckCircle : XCircle;
			}

			return j === answers.indexOf(correctAnswer) ? CheckCircle : null;
		});

		// give user feedback on answer
		const el = document.getElementById(answer);

		el?.style.setProperty('--animate-duration', '1s');
		if (answer === correctAnswer) {
			const audio = document.getElementById('success') as HTMLAudioElement;
			audio.play();
			el?.classList.add('animate__tada');
		} else {
			const audio = document.getElementById('error') as HTMLAudioElement;
			audio.play();
			el?.classList.add('animate__shakeX');
		}
	};
</script>

<Transition
	show={playStore.questionIndex === index}
	enter="transform transition duration-[400ms] delay-500"
	enterFrom="opacity-0 rotate-[-120deg] scale-50"
	enterTo="opacity-100 rotate-0 scale-100"
	leave="transform duration-200 transition ease-in-out"
	leaveFrom="opacity-100 rotate-0 scale-100 "
	leaveTo="opacity-0 scale-95"
>
	<div
		class="col gap-4 rounded-lg border-2 p-4 dark:border-light"
		style="min-width: 320px; max-width: 580px;"
	>
		<div class="flex justify-between">
			<p>{category}</p>
			<p style={`color: ${colorMap[difficulty]}`}>{difficulty}</p>
		</div>

		<Timer {index} />

		<strong>{question}</strong>

		<section aria-label="Question answers" class="grid grid-cols-2 grid-rows-2 gap-4 items-stretch">
			{#each answers as answer, i}
				<Button
					parentStyles="self-center"
					class={[
						'animate__animated flex w-full h-full items-center justify-center gap-2',
						questionStore.timers[index].state === 'ended' ? 'cursor-not-allowed' : ''
					]}
					onclick={() => handleUserAnswer(answer, i)}
					id={answer}
					disabled={questionStore.timers[index].state !== 'started'}
					primary={!questionStore.timers[index].userAnswer &&
						questionStore.timers[index].state === 'ended' &&
						answer === correctAnswer}
					data-testid={answer}
				>
					{#if answerFeedback[i]}
						<span
							data-testid={`feedback-${answer === correctAnswer ? 'correct' : 'incorrect'}-${i}`}
						>
							<Icon src={answerFeedback[i]} size="20" />
						</span>
					{/if}
					<p>{decodeHTMLEntities(answer)}</p>
				</Button>
			{/each}
		</section>

		<QuestionControls {index} />

		<audio id="success">
			<source src="/success.mp3" type="audio/mpeg" />
			Your browser does not support the audio element.
		</audio>
		<audio id="error">
			<source src="/error.mp3" type="audio/mpeg" />
			Your browser does not support the audio element.
		</audio>
	</div>
</Transition>

