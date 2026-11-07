<script>
	import { Icon, Eye, EyeSlash } from 'svelte-hero-icons';

	let { show, value, name, placeholder = undefined, label, id = name, autocomplete = undefined } = $props();
</script>

<div class="relative w-full">
	<input
		required
		class="field pr-12"
		type={show ? 'text' : 'password'}
		bind:value
		{id}
		{name}
		{placeholder}
		{autocomplete}
	/>
	<button
		type="button"
		class="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded text-muted hover:text-chalk"
		aria-label={label}
		aria-pressed={show}
		onclick={() => (show = !show)}
	>
		<Icon src={show ? EyeSlash : Eye} size="22" />
	</button>
</div>
