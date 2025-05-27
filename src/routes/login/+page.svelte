<script>
        import AuthForm from 'components/authForm.svelte';
        let username = $state('');
        let password = $state('');

        let { data, form } = $props();

        console.debug({data,form});
</script>

<AuthForm {form} route="/login">
        <input type="email" bind:value={username} name="username" placeholder="Email" required />
        <input type="password" bind:value={password} name="password" placeholder="Password" required />
</AuthForm>

