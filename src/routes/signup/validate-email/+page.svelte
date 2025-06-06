<script lang="ts">
        import Button from 'components/button.svelte';
        import SpinningLoader from 'components/spinningLoader.svelte';
        import VerificationCodeInput from 'components/verificationCodeInput.svelte';
	import { createDisclosure } from 'svelte-headlessui';
        import { enhance } from '$app/forms';
        import { goto } from '$app/navigation';
        import { page } from '$app/state';
        import { globalStore } from 'store';

        const changeEmail = createDisclosure({ expanded: false });

        let { data, form } = $props();

        let code = $state("");
        let loading = $state(false)
        let message = $state("");
        let email = $state(data.email);
        let newEmail = $state('');
        let updatingEmail = $state({ loading: false, message: '', error: '' });
        let resendingEmail = $state({ loading: false, mesage: '', error: '' });
        let verifyingEmail = $state({ loading: false, message: '', error: '' });

        const handleUserAction = async (type, request) => {
                loading = true;
                request.loading = true;

                return async ({ result }) => {
                        if (result.type === 'failure') {
                                request.error = result.data.error;
                                request.loading = false;
                                loading = false;
                                return;
                        }

                        request.message = result.data.message;
                        globalStore.update(() => ({ ...$globalStore, user: result.data.user }));
                        request.loading = false;
                        loading = false;

                        if (type === 'change') {
                                email = result.data.newEmail;
                                newEmail = '';
                                changeEmail.close();
                        } else if (type === 'resend') {
                                request.error = '';
                                verifyingEmail.error = '';
                        }

                        const redirectTo = result.data.redirectTo;
                        if (redirectTo) goto(redirectTo);
                }
        }
</script>

<div class="col gap-4 p-8 md:w-3/6 mx-auto">
        <p>Enter the code sent to {email}</p>

        <div class="dark:bg-neutral-500 space-y-2 overflow-y-auto p-4 rounded-lg shadow-md dark:border-transparent border-2 col gap-2">
                <form id="verification-form" action="?/verifyCode" class="col gap-2" use:enhance={() => handleUserAction('verify', verifyingEmail)} method="POST">
                        <input type="hidden" bind:value={$globalStore.user.username} name="username" />
                        <input type="hidden" bind:value={email} name="email" />
                        <VerificationCodeInput error={verifyingEmail.error} />
                        <Button primary nativeProps={{ disabled: loading }}>
                                Send
                                {#if verifyingEmail.loading}
                                        <SpinningLoader size="8" />
                                {/if}
                        </Button>

                        {#if verifyingEmail.error}
                                <p class="text-red-800">{verifyingEmail.error}</p>
                        {/if}
                </form>

                <form id="verification-form" use:enhance={() => handleUserAction('resend', resendingEmail)} action="?/resendCode" method="POST">
                        <input type="hidden" bind:value={email} name="email" />
                        {#if resendingEmail.loading}
                                <div class="flex items-center gap-2">
                                        Requesting new code
                                        <SpinningLoader size="8" />
                                </div>
                        {:else}
                                <button class="underline">Request new code</button>
                        {/if}
                </form>

                <div class="col gap-3">
                        <div class="flex gap-2 text-sm">
                                <p>Didn't receive a code?</p>
                                <button class={{ underline: !$changeEmail.expanded }} type="button" use:changeEmail.button>Change email</button>
                        </div>

                        {#if $changeEmail.expanded}
                                <form
                                        use:changeEmail.panel
                                        class="flex gap-2 flex-wrap"
                                        action="?/changeEmail"
                                        method="POST"
                                        use:enhance={() => handleUserAction('change', updatingEmail)}
                                >
                                        <input class="rounded-md dark:text-dark p-2" placeholder="New email" type="email" bind:value={newEmail} name="newEmail" />
                                        <input type="hidden" bind:value={$globalStore.user.username} name="username" />
                                        <Button nativeProps={{ disabled: loading }}>
                                                Change
                                                {#if updatingEmail.loading}
                                                        <SpinningLoader size="8" />
                                                {/if}
                                        </Button>
                                </form>
                        {/if}
                </div>
        </div>
</div>

<style>
        @media (prefers-color-scheme: dark) {
                :global(#verification-form button:hover) {
                        @apply text-dark border-dark;
                }
        }
</style>

