<script lang="ts">
	import { Button, VerificationCodeInput, SpinningLoader } from 'components';
	import { createDisclosure } from 'svelte-headlessui';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { globalStore } from 'store';

	const changeEmail = createDisclosure({ expanded: false });

	let { data } = $props();

	let loading = $state(false);
	let email = $state(data.email);
	let newEmail = $state('');
	let updatingEmail = $state({ loading: false, message: '', error: '' });
	let resendingEmail = $state({ loading: false, message: '', error: '' });
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
			globalStore.user = result.data.user;
			request.loading = false;
			loading = false;

			if (type === 'change') {
				email = result.data.newEmail;
				newEmail = '';
				request.error = '';
				changeEmail.close();
			} else if (type === 'resend') {
				request.error = '';
				verifyingEmail.error = '';
			}

			const redirectTo = result.data.redirectTo;
			if (redirectTo) goto(redirectTo);
		};
	};
</script>

<svelte:head>
	<title>Confirm your email · Trivia Mania</title>
</svelte:head>

<section class="mx-auto flex min-h-full max-w-md flex-col justify-center gap-6 px-4 py-10">
	<div class="col gap-2">
		<h1 class="text-3xl leading-none">Check your inbox</h1>
		<p class="text-muted">
			Enter the 6-digit code we sent to <span class="font-semibold text-chalk">{email}</span>. It
			works for 10 minutes.
		</p>
	</div>

	<div class="panel col gap-5 p-5 md:p-6">
		<form
			id="verification-form"
			action="?/verifyCode"
			class="col gap-4"
			use:enhance={() => handleUserAction('verify', verifyingEmail)}
			method="POST"
		>
			<VerificationCodeInput error={verifyingEmail.error} />

			{#if verifyingEmail.error}
				<p class="rounded border border-hard/50 bg-hard/10 px-3 py-2 text-sm text-hard" role="alert">
					{verifyingEmail.error}
				</p>
			{/if}

			<Button primary disabled={loading} class="w-full">
				Confirm email
				{#if verifyingEmail.loading}
					<SpinningLoader size="5" />
				{/if}
			</Button>
		</form>

		<div class="col gap-3 border-t border-line pt-4 text-sm">
			<form
				use:enhance={() => handleUserAction('resend', resendingEmail)}
				action="?/resendCode"
				method="POST"
				class="flex flex-wrap items-center gap-x-2 gap-y-1"
			>
				<span class="text-muted">No code yet?</span>
				{#if resendingEmail.loading}
					<span class="flex items-center gap-2">Sending a new code <SpinningLoader size="4" /></span>
				{:else}
					<button class="link min-h-8" disabled={loading}>Send a new code</button>
				{/if}
				{#if resendingEmail.error}
					<span class="w-full text-hard" role="alert">{resendingEmail.error}</span>
				{:else if resendingEmail.message}
					<span class="w-full text-easy" role="status">{resendingEmail.message}</span>
				{/if}
			</form>

			<div class="flex flex-wrap items-center gap-x-2 gap-y-1">
				<span class="text-muted">Wrong address?</span>
				<button class="link min-h-8" type="button" use:changeEmail.button>
					{$changeEmail.expanded ? 'Keep this email' : 'Change email'}
				</button>
			</div>

			{#if $changeEmail.expanded}
				<form
					use:changeEmail.panel
					class="col gap-2"
					action="?/changeEmail"
					method="POST"
					use:enhance={() => handleUserAction('change', updatingEmail)}
				>
					<label class="label" for="new-email">New email</label>
					<div class="flex gap-2">
						<input
							id="new-email"
							class="field"
							type="email"
							autocomplete="email"
							required
							bind:value={newEmail}
							name="newEmail"
						/>
						<Button disabled={loading}>
							Change
							{#if updatingEmail.loading}
								<SpinningLoader size="5" />
							{/if}
						</Button>
					</div>
					{#if updatingEmail.error}
						<p class="text-hard" role="alert">{updatingEmail.error}</p>
					{/if}
				</form>
			{/if}
		</div>
	</div>
</section>
