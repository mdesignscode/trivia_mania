<script lang="ts">
	import SettingForm from './components/settingForm.svelte';
	import { Button, PasswordInput, SpinningLoader } from 'components';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { globalStore } from 'store';
	import { createDisclosure } from 'svelte-headlessui';
	import { Icon, XMark } from 'svelte-hero-icons';

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

<div class="mx-auto space-y-2 px-6 py-4 md:w-[55%] md:space-y-4 md:p-8">
	<div class="mx-auto mb-4 flex w-fit items-center gap-4 md:mb-6">
		<img
			class="aspect-square size-12 rounded-full border"
			src={globalStore.user?.avatar}
			alt="User icon"
		/>

		<div>
			<p class="text-xl">{globalStore.user?.username}</p>
			<p class="text-xs italic text-gray-500 dark:text-gray-200">@{globalStore.user?.email}</p>
		</div>
	</div>
	<h1 class="text-center text-lg font-bold md:text-xl">Settings</h1>
	<div class="space-y-2 rounded-sm border p-2 md:rounded-md md:px-6 md:py-4">
		<!-- change avatar -->
		<div class="relative">
			<SettingForm
				heading="Change avatar"
				disclosure={changeAvatar}
				action="?/changeAvatar"
				handler={() => handleChangeUserInfo('avatar')}
				{updating}
				feedback={changeAvatarFeedback}
			>
				<input
					required
					class="mr-1 rounded-sm bg-white p-1"
					type="file"
					accept="image/*"
					name="avatar"
				/>
			</SettingForm>

			<!-- set to default if not already default avatar -->
			{#if globalStore.user?.avatar !== '/images/icons8-user-64.png' && $changeAvatar.expanded}
				<form
					class="absolute bottom-4 right-4 px-2"
					method="POST"
					action="?/setDefaultAvatar"
					use:enhance={handleChangeUserInfo}
				>
					<input type="hidden" bind:value={globalStore.user.username} name="username" />
					<Button disabled={updating}>Set default</Button>
				</form>
			{/if}
		</div>

		<!-- change username -->
		<SettingForm
			heading="Change display name"
			disclosure={changeUsername}
			action="?/changeUsername"
			handler={() => handleChangeUserInfo('username')}
			feedback={changeUsernameFeedback}
			{updating}
		>
			<input
				required
				class="mr-1 rounded-sm p-1"
				type="text"
				bind:value={newUsername}
				name="newUsername"
				placeholder="New display name"
			/>
		</SettingForm>

		<!-- change password -->
		<SettingForm
			{updating}
			heading="Change password"
			disclosure={changePassword}
			action="?/changePassword"
			handler={() => handleChangeUserInfo('password')}
			feedback={changePassFeedback}
		>
			<PasswordInput
				label="Show current password"
				name="currentPassword"
				placeholder="Current password"
				show={showCurrentPass}
				value={currentPass}
			/>
			<PasswordInput
				label="Show new password"
				name="newPassword"
				placeholder="New password"
				show={showNewPass}
				value={newPass}
			/>
		</SettingForm>

		<!-- log out -->
		<SettingForm
			heading="Log out"
			disclosure={logout}
			action="?/logout"
			handler={() => handleChangeUserInfo('logout')}
			{updating}
			cta="Confirm"
			{sessionDestroyed}
		/>

		<!-- delete account -->
		<SettingForm
			heading="Delete my account"
			disclosure={deleteAccount}
			action="?/deleteAccount"
			handler={() => handleChangeUserInfo('delete')}
			{updating}
			cta="I am sure"
			{sessionDestroyed}
		>
			<p class="text-sm">Are you sure? This action cannot be undone</p>
		</SettingForm>
	</div>
</div>

<style>
	input {
		@apply dark:bg-gray-100 dark:text-dark;
	}
</style>
