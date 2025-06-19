<script lang="ts">
	import { AuthForm, PasswordInput } from 'components';
	import { globalStore } from 'store';
	import { goto } from '$app/navigation';

	let email = $state('');
	let username = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
	let showPassword = $state(false);

	const handleSignup = async () => {
		loading = true;

		return async ({ result }) => {
			if (result.type === 'failure') {
				error = result.data.error;
				loading = false;
				return;
			}
                        globalStore.user = result.data.user;

			loading = false;
			goto(result.data.redirectTo);
		};
	};
</script>

<AuthForm {error} {loading} handler={handleSignup} route="/signup">
	<input type="text" bind:value={username} name="username" placeholder="Username" required />
	<input type="email" bind:value={email} name="email" placeholder="Email" required />
	<PasswordInput
		label="Create password"
		name="password"
		placeholder="Password"
		show={showPassword}
		value={password}
	/>
</AuthForm>

