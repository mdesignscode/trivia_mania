<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		primary?: boolean;
		play?: boolean;
		danger?: boolean;
		parentStyles?: string;
	}
	let { primary, play, danger, children, parentStyles, ...nativeProps }: Props = $props();

	const variant = $derived(danger ? 'danger' : primary || play ? 'primary' : 'default');
</script>

<button {...nativeProps} class={['btn', variant, nativeProps.class, parentStyles]}>
	{@render children?.()}
</button>

<style>
	.btn {
		@apply inline-flex min-h-11 items-center justify-center gap-3 rounded border px-5 py-2 font-display text-lg font-bold uppercase tracking-wider transition-colors duration-150;
	}

	.btn:disabled {
		@apply cursor-not-allowed opacity-45;
	}

	.default {
		@apply border-line bg-raised text-chalk;
	}
	.default:not(:disabled):hover {
		@apply border-muted/60 bg-line;
	}

	.primary {
		@apply border-amber bg-amber text-ink;
	}
	.primary:not(:disabled):hover {
		@apply border-amber-hi bg-amber-hi;
	}

	.danger {
		@apply border-hard/70 bg-transparent text-hard;
	}
	.danger:not(:disabled):hover {
		@apply bg-hard text-ink;
	}
</style>
