<script lang="ts">
        import Button from 'components/button.svelte';
        import VerificationCodeInput from 'components/verificationCodeInput.svelte';
        import { enhance } from '$app/forms';
        import { page } from '$app/state';
        let email = page.url.searchParams.get('email');

        let { data, form } = $props();

        let code = $state("");
</script>

<div class="col gap-4 p-8 md:w-3/6 mx-auto">
        <p>Enter the code sent to your email</p>

        <div class="dark:bg-neutral-500 space-y-2 overflow-y-auto p-4 rounded-lg shadow-md dark:border-transparent border-2 col gap-3 gap-2">
                <form id="verification-form" action="?/verifyCode" class="col gap-2" use:enhance method="POST">
                        <VerificationCodeInput error={form?.error} />
                        <Button primary>Send</Button>
                        <input type="hidden" bind:value={email} name="email" />
                </form>
                {#if form?.error}
                        <form id="verification-form" use:enhance action="?/resendCode" method="POST">
                                <p class="text-red-800">{form?.error}</p>
                                <button class="underline">Request new code</button>
                                <input type="hidden" bind:value={email} name="email" />
                        </form>
                {/if}
        </div>
</div>

<style>
        @media (prefers-color-scheme: dark) {
                :global(#verification-form button:hover) {
                        @apply text-dark border-dark;
                }
        }
</style>

