<script lang="ts">
        import AuthForm from 'components/authForm.svelte';

        let email = $state("");
        let username = $state("");
        let password = $state("");

        import { page } from '$app/state';
        let { data, form } = $props();
        console.debug({data,form,state:page?.state});
</script>

{#if page?.state}{(() => console.log({state:page?.state}))()}{/if}

<AuthForm {form} route="/signup">
        <input type="text" bind:value={username} name="username" placeholder="Username" required />
        <input type="email" bind:value={email} name="email" placeholder="Email" required />
        <input type="password" bind:value={password} name="password" placeholder="Password" required />

        {#if form?.error}
                <p class="bg-red-800">{form?.error}</p>
        {/if}
</AuthForm>

