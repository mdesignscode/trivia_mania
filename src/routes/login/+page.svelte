<script>
        import AuthForm from 'components/authForm.svelte';
        import { globalStore } from 'store';
        import { goto } from '$app/navigation';

        let username = $state('');
        let password = $state('');

        let error = $state('');
        let loading = $state(false)

        const handleLogin = async () => {
                loading = true;

                return async ({ result, update }) => {
                        if (result.type === 'failure') {
                                error = result.data.error;
                                loading = false;
                                return;
                        }
                        globalStore.update(() => ({ ...$globalStore, user: result.data }));

                        update();
                        loading = false;
                        goto('/');
                }
        }
</script>

<AuthForm {error} {loading} handler={handleLogin} route="/login">
        <input type="email" bind:value={username} name="username" placeholder="Email" required />
        <input type="password" bind:value={password} name="password" placeholder="Password" required />
</AuthForm>

