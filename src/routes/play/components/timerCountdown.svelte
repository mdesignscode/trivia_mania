<script lang="ts">
	import { questionStore as store, playStore as allQuestions } from 'store';

	const TIME_LIMIT = 30;
	let timePassed = $state(0);
	let timeLeft = $state(TIME_LIMIT);
	let remainingPathColor = $state('green');
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	let { index } = $props();

	$effect(() => {
		if (store.timers[index].state === 'continue later') return;

		if (store.timers[index].state === 'ended') {
			if (store.timers[index].timer) {
				clearInterval(store.timers[index].timer);
				store.timers[index].timer = null;
			}
			return;
		}

		if (!store.timers[index].timer && store.timers[index].state === 'started') {
			store.timers[index].timer = setInterval(() => {
				timePassed++;
				timeLeft = TIME_LIMIT - timePassed;

				remainingPathColor = timeLeft <= 5 ? 'red' : timeLeft <= 10 ? 'orange' : 'green';

				if (timeLeft < 1 && !store.timers[index].userAnswer) {
					const el = document.getElementById(allQuestions.questions[index].correctAnswer);
					el?.style.setProperty('--animate-duration', '1s');
					el?.classList.add('animate__rubberBand');
					el.style.opacity = '100';

					const audio = document.getElementById('error') as HTMLAudioElement;
					if (navigator.getAutoplayPolicy(audio) === 'allowed') {
						audio.play();
					}

					clearInterval(store.timers[index].timer);
					store.timers[index].timer = null;
					store.timers[index].state = 'ended';
				}
			}, 1000);
		}
	});

	let percentage = $derived(((TIME_LIMIT - timeLeft) / TIME_LIMIT) * 100);
</script>

<svg
	viewBox="0 0 100 5"
	xmlns="http://www.w3.org/2000/svg"
	style={`border: 2px solid ${remainingPathColor}; border-radius: 5px;`}
	data-testid="timer-container"
>
	<line
		x1="0"
		y1="5"
		x2={percentage}
		y2="5"
		stroke={remainingPathColor}
		stroke-width="20"
		class="transition-all"
	/>
	{timeLeft}
</svg>
