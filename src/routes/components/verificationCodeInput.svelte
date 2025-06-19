<script>
	import { createEventDispatcher, onMount } from 'svelte';

	let { length = 6, error } = $props();
	const dispatch = createEventDispatcher();

	let code = $state('');

	let inputs = $state(Array(length).fill(''));
	let refs = [];
	$effect(() => {
		if (error) inputs = Array(length).fill('');
	});

	function handleInput(e, index) {
		const val = e.target.value.replace(/\D/g, '');

		if (val.length > 1) {
			// Handle paste (split characters)
			const chars = val.split('');
			chars.forEach((char, i) => {
				if (index + i < length) {
					inputs[index + i] = char;
				}
			});
			tick().then(() => {
				const nextIndex = Math.min(index + chars.length, length - 1);
				refs[nextIndex]?.focus();
			});
		} else {
			inputs[index] = val;
			if (val && index < length - 1) {
				refs[index + 1]?.focus();
			}
		}

		checkComplete();
	}

	function handleKeydown(e, index) {
		if (e.key === 'Backspace') {
			if (!inputs[index] && index > 0) {
				refs[index - 1]?.focus();
			}
		}
	}

	function handlePaste(e) {
		const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
		pasted.split('').forEach((char, i) => {
			inputs[i] = char;
		});
		tick().then(() => {
			refs[pasted.length - 1]?.focus();
		});
		e.preventDefault();
		checkComplete();
	}

	function checkComplete() {
		if (inputs.every((i) => i.length === 1)) {
			dispatch('complete', inputs.join(''));
			code = inputs.join('');
		}
	}
</script>

<div onpaste={handlePaste} class="flex w-full gap-[0.5rem]">
	{#each inputs as value, i}
		<input
			bind:this={() => {}, (el) => (refs[i] = el)}
			class="size-8 flex-1 rounded-md border border-dark text-center text-lg text-dark focus:outline-dark"
			type="text"
			maxlength="1"
			bind:value={inputs[i]}
			oninput={(e) => handleInput(e, i)}
			onkeydown={(e) => handleKeydown(e, i)}
			inputmode="numeric"
			pattern="[0-9]*"
			autocomplete="one-time-code"
			required
		/>
	{/each}
	<input type="hidden" bind:value={code} name="code" />
</div>
