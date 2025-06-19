<script>
        import { Button, SpinningLoader } from 'components';
	import { enhance } from '$app/forms';
	import { globalStore } from 'store';

	let {
		children,
		heading,
		disclosure,
		action,
		handler,
		feedback,
		cta = 'Change',
		updating,
		sessionDestroyed = false
	} = $props();
	const buttonStyles =
		'md:no-underline md:border-transparent md:border transition-colors rounded-md md:p-2';
</script>

<div
	class={[
		'rounded-sm border border-transparent transition-all md:rounded-md',
		$disclosure.expanded && 'border-gray-400 p-2 dark:border-light'
	]}
>
	<button
		class={[buttonStyles, !$disclosure.expanded && 'underline md:border md:border-white']}
		use:disclosure.button
	>
		{heading}
	</button>

	{#if $disclosure.expanded}
		<form
			enctype={action === '?/changeAvatar' ? 'multipart/form-data' : ''}
			use:disclosure.panel
			class="col gap-2 p-2"
			use:enhance={handler}
			{action}
			method="POST"
		>
			<div class="col gap-2">
				{@render children?.()}
			</div>
			<!-- find user by username on server -->
			<input type="hidden" bind:value={$globalStore.user.username} name="username" />
			<Button
				danger={['?/logout', '?/deleteAccount'].includes(action)}
                                class="self-start"
                                disabled={updating || sessionDestroyed}
			>
				{cta}
				{#if updating}
					<SpinningLoader size="8" />
				{/if}
			</Button>
			{#if feedback}
				<p class="text-sm italic">{feedback}</p>
			{/if}
		</form>
	{/if}
</div>

