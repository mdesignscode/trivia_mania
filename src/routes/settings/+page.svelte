<script lang="ts">
	import SettingForm from './components/settingForm.svelte';
	import { PasswordInput } from 'components';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { globalStore } from 'store';
	import { createDisclosure } from 'svelte-headlessui';

	const changeAvatar = createDisclosure({ expanded: false });
	const logout = createDisclosure({ expanded: false });
	const changeUsername = createDisclosure({ expanded: false });
	const changePassword = createDisclosure({ expanded: false });
	const deleteAccount = createDisclosure({ expanded: false });

	let newUsername = $state('');
	let currentPass = $state('');
	let newPass = $state('');
	let updating = $state(false);
	let avatar = $state(null);
	let showCurrentPass = $state(false);
	let showNewPass = $state(false);
	let sessionDestroyed = $state(false);

	let changeAvatarFeedback = $state('');
	let changePassFeedback = $state('');
	let changeUsernameFeedback = $state('');
	let logoutFeedback = $state('');
	let deleteAccountFeedback = $state('');

	const handleChangeUserInfo = async (type: string) => {
		updating = true;
		const isSessiondestroy = ['logout', 'delete'].includes(type);

		return async ({ update, result }) => {
			if (result.type === 'failure') {
				const errorMessage = result.data.error;
				if (type === 'avatar') changeAvatarFeedback = errorMessage;
				if (type === 'username') changeUsernameFeedback = errorMessage;
				if (type === 'password') changePassFeedback = errorMessage;
				if (type === 'delete') deleteAccountFeedback = errorMessage;
				if (type === 'logout') logoutFeedback = errorMessage;
			} else {
				const successMessage = result.data.message;
				if (type === 'avatar') changeAvatarFeedback = successMessage;
				if (type === 'username') changeUsernameFeedback = successMessage;
				if (type === 'password') changePassFeedback = successMessage;

				globalStore.user = result.data.user;

				if (isSessiondestroy) {
					// keep session destroy buttons disabled
					updating = false;
					sessionDestroyed = true;
					goto(result.data.redirectTo);
					return;
				}
			}

			update();
			updating = false;
		};
	};
</script>

<svelte:head>
	<title>Settings · Trivia Mania</title>
</svelte:head>

<section class="mx-auto col max-w-2xl gap-8 px-4 py-8 md:px-8 md:py-10">
	<div class="flex items-center gap-4">
		<img
			class="size-14 rounded-full object-cover ring-2 ring-line"
			src={globalStore.user?.avatar}
			alt=""
		/>
		<div class="col min-w-0 gap-0.5">
			<h1 class="truncate text-3xl leading-none">{globalStore.user?.username}</h1>
			<p class="truncate text-muted">{globalStore.user?.email}</p>
		</div>
	</div>

	<div class="col gap-3">
		<h2 class="text-xl">Profile</h2>
		<div class="panel overflow-hidden">
			<SettingForm
				heading="Avatar"
				description="Upload a picture for the scoreboard"
				disclosure={changeAvatar}
				action="?/changeAvatar"
				handler={() => handleChangeUserInfo('avatar')}
				{updating}
				feedback={changeAvatarFeedback}
				cta="Upload"
			>
				<label class="col gap-1.5">
					<span class="label">Image file</span>
					<input
						required
						class="field file:mr-3 file:rounded file:border-0 file:bg-raised file:px-3 file:py-1.5 file:font-semibold file:text-chalk"
						type="file"
						accept="image/*"
						name="avatar"
					/>
				</label>
			</SettingForm>

			<!-- set to default if not already default avatar -->
			{#if globalStore.user?.avatar !== '/images/icons8-user-64.png' && $changeAvatar.expanded}
				<form
					class="-mt-2 px-4 pb-5 md:px-5"
					method="POST"
					action="?/setDefaultAvatar"
					use:enhance={() => handleChangeUserInfo('avatar')}
				>
					<input type="hidden" bind:value={globalStore.user.username} name="username" />
					<button class="link text-sm" disabled={updating}>Use the default avatar instead</button>
				</form>
			{/if}

			<SettingForm
				heading="Display name"
				description="How you appear on the scoreboard"
				disclosure={changeUsername}
				action="?/changeUsername"
				handler={() => handleChangeUserInfo('username')}
				feedback={changeUsernameFeedback}
				{updating}
			>
				<label class="col gap-1.5">
					<span class="label">New display name</span>
					<input required class="field" type="text" bind:value={newUsername} name="newUsername" />
				</label>
			</SettingForm>

			<SettingForm
				{updating}
				heading="Password"
				description="Change the password you sign in with"
				disclosure={changePassword}
				action="?/changePassword"
				handler={() => handleChangeUserInfo('password')}
				feedback={changePassFeedback}
			>
				<div class="col gap-1.5">
					<label class="label" for="currentPassword">Current password</label>
					<PasswordInput
						label="Show current password"
						name="currentPassword"
						autocomplete="current-password"
						show={showCurrentPass}
						value={currentPass}
					/>
				</div>
				<div class="col gap-1.5">
					<label class="label" for="newPassword">New password</label>
					<PasswordInput
						label="Show new password"
						name="newPassword"
						autocomplete="new-password"
						show={showNewPass}
						value={newPass}
					/>
				</div>
			</SettingForm>
		</div>
	</div>

	<div class="col gap-3">
		<h2 class="text-xl">Account</h2>
		<div class="panel overflow-hidden">
			<SettingForm
				heading="Log out"
				description="Sign out on this device"
				disclosure={logout}
				action="?/logout"
				handler={() => handleChangeUserInfo('logout')}
				feedback={logoutFeedback}
				{updating}
				cta="Log out"
				{sessionDestroyed}
			/>

			<SettingForm
				heading="Delete account"
				description="Remove your account and all your stats"
				disclosure={deleteAccount}
				action="?/deleteAccount"
				handler={() => handleChangeUserInfo('delete')}
				feedback={deleteAccountFeedback}
				{updating}
				cta="Delete my account"
				{sessionDestroyed}
			>
				<p class="text-sm">This permanently deletes your account and stats. It cannot be undone.</p>
			</SettingForm>
		</div>
	</div>
</section>
