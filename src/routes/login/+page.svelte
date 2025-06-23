<script>
	import { AuthForm, PasswordInput } from 'components';
	import { globalStore } from 'store';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);

	let error = $state('');
	let loading = $state(false);

	const handleLogin = async () => {
		loading = true;

		return async ({ result, update }) => {
			if (result.type === 'failure') {
				error = result.data.error;
				loading = false;
				return;
			}
                        update();

			globalStore.user = result.data.user;
			loading = false;

			goto('/');
		};
	};
</script>

<AuthForm {error} {loading} handler={handleLogin} route="/login">
	<input type="email" bind:value={email} name="email" placeholder="Email" required />
	<PasswordInput
		label="Enter password"
		name="password"
		placeholder="Password"
		show={showPassword}
		value={password}
	/>
</AuthForm>

