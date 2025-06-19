<script lang="ts">
	import { SpinningLoader, Button } from 'components';
	import { enhance } from '$app/forms';

	let { children, route, error, handler, loading } = $props();

	const routeOptions = {
		'/signup': {
			head: 'Create an account to save your progress',
			footer: 'Already have an account?',
			alt: 'Sign in',
			altRoute: '/login',
			cta: 'Sign up'
		},
		'/login': {
			head: 'Welcome back',
			footer: "Don't have an account?",
			alt: 'Sign up',
			altRoute: '/signup',
			cta: 'Sign in'
		}
	};
</script>

<div class="col gap-4 px-8 py-6 md:mx-auto md:w-4/6">
	<h1 class="text-lg">{routeOptions[route].head}</h1>
	<form
		id="auth-form"
		use:enhance={handler}
		method="POST"
		class="col gap-2 rounded-lg border-2 bg-neutral-200 p-4 shadow-md dark:border-transparent dark:bg-neutral-500"
	>
		{@render children()}
		<button
			disabled={loading}
			class="flex items-center justify-center gap-4 rounded-sm border border-accent bg-accent py-1 transition-all hover:bg-transparent disabled:opacity-60"
		>
			{routeOptions[route].cta}

			{#if loading}
				<SpinningLoader size="8" />
			{/if}
		</button>
		{#if error}
			<p style="color:red">{error}</p>
		{/if}
	</form>

	<p>
		{routeOptions[route].footer}{' '}
		<a class="underline" href={routeOptions[route].altRoute}>{routeOptions[route].alt}</a>
	</p>
</div>

<style>
	:global(#auth-form input) {
		@apply rounded-sm p-2 text-dark;
	}
</style>

