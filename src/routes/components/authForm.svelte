<script lang="ts">
        import SpinningLoader from './spinningLoader.svelte';
        import Button from './button.svelte'
        import { enhance } from '$app/forms';

        let { children, route, error, handler, loading } = $props();

        const routeOptions = {
                '/signup': {
                        head: 'Create an account to save your progress',
                        footer: 'Already have an account?',
                        alt: 'Sign in',
                        altRoute: '/login',
                        cta: 'Sign up',
                },
                '/login': {
                        head: 'Welcome back',
                        footer: "Don't have an account?",
                        alt: 'Sign up',
                        altRoute: '/signup',
                        cta: 'Sign in',
                },
        };
</script>

<div class="col gap-4 md:mx-auto md:w-4/6 px-8 py-6">
        <h1 class="text-lg">{routeOptions[route].head}</h1>
        <form id="auth-form" use:enhance={handler} method="POST" class="bg-neutral-200 dark:bg-neutral-500 p-4 rounded-lg shadow-md dark:border-transparent border-2 col gap-2">
                {@render children()}
                <button disabled={loading} class="disabled:opacity-60 flex gap-4 border border-accent items-center justify-center py-1 rounded-sm bg-accent hover:bg-transparent transition-all">
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
                {routeOptions[route].footer}{" "}
                <a class="underline" href={routeOptions[route].altRoute}>{routeOptions[route].alt}</a>
        </p>
</div>

<style>
        :global(#auth-form input) {
                @apply p-2 rounded-sm text-dark;
        }
</style>

