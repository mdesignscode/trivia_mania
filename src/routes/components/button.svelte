<script lang="ts">
	let { primary, cta, play, danger, showCategories, children, type, ...nativeProps } = $props();

	const color = '#ffcb74';
	const dark = '#2f2f2f';
	const light = '#f6f6f6';

	// Dynamic classes
	const classes = [
		'base',
		danger && 'danger',
		primary && 'primary',
		cta && 'cta',
		showCategories && 'show-categories',
		play && 'play'
	]
		.filter(Boolean)
		.join(' ');
</script>

<button
	{...nativeProps}
	{type}
	class={[classes, nativeProps.class]}
	style={showCategories
		? `--category-border-color: ${primary ? light : dark}; --category-hover-color: ${primary ? dark : light};`
		: ''}
>
	{@render children()}
</button>

<style>
	:global(button) {
		font-family: inherit;
	}

	button.base {
		@apply flex items-center justify-center gap-4 disabled:opacity-60;
		background: transparent;
		border-radius: 5px;
		border: 2px solid #ffcb74;
		padding: 0.25em;
		transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	button.base:hover {
		background-color: #ffcb74;
		color: white;
	}

	@media (prefers-color-scheme: dark) {
		button.base:hover {
			color: #2f2f2f;
		}
	}

	/* Primary */
	button.primary {
		background: #ffcb74;
		color: white;
	}

	button.primary:hover {
		border-color: #2f2f2f;
		background: transparent;
		color: #2f2f2f;
	}

	@media (prefers-color-scheme: dark) {
		button.primary {
			color: #2f2f2f;
		}

		button.primary:hover {
			border-color: #f6f6f6;
			color: #f6f6f6;
		}
	}

	/* Danger */
	button.danger {
		@apply border-red-400 bg-transparent p-2 text-red-400;
	}

	button.danger:hover {
		@apply bg-red-400 text-white;
	}

	/* CTA */
	button.cta {
		color: #f6f6f6;
		border: 2px solid #ffcb74;
		padding: 0.75rem;
		letter-spacing: 2px;
		min-width: 160px;
		height: 48px;
		text-transform: uppercase;
		white-space: normal;
		font-weight: 700;
		margin-top: 1.25rem;
		display: inline-block;
		background-color: #ffcb74;
	}

	button.cta:hover {
		background-color: transparent;
		color: #2f2f2f;
		border-color: #2f2f2f;
		border-radius: 500px;
	}

	@media (prefers-color-scheme: dark) {
		button.cta {
			color: #2f2f2f;
		}

		button.cta:hover {
			border-color: #f6f6f6;
			color: #f6f6f6;
		}

		button.cta.play:hover {
			border-color: #2f2f2f;
			color: #2f2f2f;
		}
	}

	/* Show categories modifier */
	button.show-categories {
		border-color: var(--category-border-color);
		opacity: 0.7;
	}

	button.show-categories.primary {
		opacity: 1;
	}

	button.show-categories.primary:hover {
		background-color: #f6f6f6;
		@apply dark:border-dark dark:text-dark;
	}

	button.play {
		@apply border-dark hover:bg-light hover:text-dark dark:border-light hover:dark:border-dark;
	}
</style>

