<script lang="ts">
        import { enhance } from '$app/forms';
        import Button from 'components/button.svelte'

        let { children, route, form } = $props();
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
        <strong class="text-center text-lg underline">Trivia Mania</strong>
        <h1 class="text-lg">{routeOptions[route].head}</h1>
        <form id="auth-form" use:enhance method="POST" class="bg-neutral-200 dark:bg-neutral-500 p-4 rounded-lg shadow-md dark:border-transparent border-2 col gap-3 gap-2">
                {@render children()}
                <Button type='submit' cta>{routeOptions[route].cta}</Button>
                {#if form?.error}
                        <p style="color:red">{form?.error}</p>
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

