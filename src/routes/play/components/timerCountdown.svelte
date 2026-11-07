<script lang="ts">
	import { questionStore as store } from 'store';

	const TIME_LIMIT = 30;
	let timePassed = $state(0);
	let timeLeft = $state(TIME_LIMIT);

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

				if (timeLeft < 1 && !store.timers[index].userAnswer) {
					// only Firefox has getAutoplayPolicy; elsewhere play() rejects
					// when autoplay is blocked, and that must not stop the timer
					const audio = document.getElementById('error') as HTMLAudioElement;
					audio.play().catch(() => {});

					clearInterval(store.timers[index].timer);
					store.timers[index].timer = null;
					store.timers[index].state = 'ended';
				}
			}, 1000);
		}
	});

	const urgent = $derived(timeLeft <= 5);
	const remaining = $derived((timeLeft / TIME_LIMIT) * 100);
</script>

<div
	class="col w-40 items-center gap-2"
	role="timer"
	aria-label={`${timeLeft} seconds left`}
	data-testid="timer-container"
>
	<div
		class={[
			'grid h-24 w-full place-items-center rounded border-2 bg-ink shadow-[inset_0_2px_10px_rgb(0_0_0/0.6)] transition-colors',
			urgent ? 'border-hard/70' : 'border-line'
		]}
	>
		{#key timeLeft}
			<span
				class={['digits clock text-[4.5rem] leading-none', urgent && 'text-hard']}
				aria-hidden="true"
			>
				{String(Math.max(timeLeft, 0)).padStart(2, '0')}
			</span>
		{/key}
	</div>
	<div class="h-1.5 w-full overflow-hidden rounded-full bg-line" aria-hidden="true">
		<div
			class={['h-full rounded-full transition-[width] duration-1000 ease-linear', urgent ? 'bg-hard' : 'bg-amber']}
			style={`width: ${remaining}%`}
		></div>
	</div>
</div>

<style>
	.clock {
		animation: clock-tick 300ms cubic-bezier(0.16, 1, 0.3, 1);
		text-shadow: 0 0 18px currentColor;
	}
</style>
