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

		return async ({ result, update }) => {
			if (result.type === 'failure') {
				error = result.data.error;
				loading = false;
				return;
			}
			update();

			globalStore.user = result.data.user;

			loading = false;
			goto(result.data.redirectTo);
		};
	};
</script>

<svelte:head>
	<title>Sign up · Trivia Mania</title>
</svelte:head>

<AuthForm {error} {loading} handler={handleSignup} route="/signup">
	<label class="col gap-1.5">
		<span class="label">Username</span>
		<input class="field" type="text" bind:value={username} name="username" autocomplete="username" required />
	</label>
	<label class="col gap-1.5">
		<span class="label">Email</span>
		<input class="field" type="email" bind:value={email} name="email" autocomplete="email" required />
	</label>
	<div class="col gap-1.5">
		<label class="label" for="password">Password</label>
		<PasswordInput
			label="Show password"
			name="password"
			autocomplete="new-password"
			show={showPassword}
			value={password}
		/>
	</div>
</AuthForm>
