<script lang="ts">
	import { SpinningLoader, Button } from 'components';
	import { enhance } from '$app/forms';

	let { children, route, error, handler, loading } = $props();

	const routeOptions = $derived({
		'/signup': {
			head: 'Join the league',
			sub: 'Create an account to save your stats and get on the scoreboard.',
			footer: 'Already have an account?',
			alt: 'Sign in',
			altRoute: '/login',
			cta: loading ? 'Creating account' : 'Create account'
		},
		'/login': {
			head: 'Welcome back',
			sub: 'Sign in to keep your streak going.',
			footer: "Don't have an account?",
			alt: 'Sign up',
			altRoute: '/signup',
			cta: loading ? 'Signing in' : 'Sign in'
		}
	});
</script>

<section class="mx-auto flex min-h-full max-w-md flex-col justify-center gap-6 px-4 py-10">
	<div class="col gap-2">
		<h1 class="text-3xl leading-none">{routeOptions[route].head}</h1>
		<p class="text-muted">{routeOptions[route].sub}</p>
	</div>

	<form id="auth-form" use:enhance={handler} method="POST" class="panel col gap-4 p-5 md:p-6">
		{@render children()}

		{#if error}
			<p class="rounded border border-hard/50 bg-hard/10 px-3 py-2 text-sm text-hard" role="alert">
				{error}
			</p>
		{/if}

		<Button primary disabled={loading} class="mt-1 w-full">
			{routeOptions[route].cta}
			{#if loading}
				<SpinningLoader size="5" />
			{/if}
		</Button>
	</form>

	<p class="text-muted">
		{routeOptions[route].footer}
		<a class="link" href={routeOptions[route].altRoute}>{routeOptions[route].alt}</a>
	</p>
</section>
