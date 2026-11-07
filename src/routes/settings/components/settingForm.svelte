<script>
	import { Button, SpinningLoader } from 'components';
	import { enhance } from '$app/forms';
	import { globalStore } from 'store';
	import { Icon, ChevronDown } from 'svelte-hero-icons';

	let {
		children = undefined,
		heading,
		description = '',
		disclosure,
		action,
		handler,
		feedback,
		cta = 'Save',
		updating,
		sessionDestroyed = false
	} = $props();

	const danger = ['?/logout', '?/deleteAccount'].includes(action);
</script>

<div class="border-t border-line first:border-t-0">
	<button
		class="flex min-h-16 w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-raised md:px-5"
		use:disclosure.button
	>
		<span class="col flex-1 gap-0.5">
			<span class={['font-semibold', danger && 'text-hard']}>{heading}</span>
			{#if description}
				<span class="text-sm text-muted">{description}</span>
			{/if}
		</span>
		<Icon
			src={ChevronDown}
			size="18"
			class={['shrink-0 text-muted transition-transform', $disclosure.expanded && 'rotate-180']}
		/>
	</button>

	{#if $disclosure.expanded}
		<form
			enctype={action === '?/changeAvatar' ? 'multipart/form-data' : undefined}
			use:disclosure.panel
			class="col gap-3 px-4 pb-5 md:px-5"
			use:enhance={handler}
			{action}
			method="POST"
		>
			{#if children}
				<div class="col gap-3">
					{@render children()}
				</div>
			{/if}
			<!-- find user by username on server -->
			<input type="hidden" bind:value={globalStore.user.username} name="username" />
			<div class="flex flex-wrap items-center gap-3">
				<Button {danger} primary={!danger} disabled={updating || sessionDestroyed}>
					{cta}
					{#if updating}
						<SpinningLoader size="5" />
					{/if}
				</Button>
				{#if feedback}
					<p class="text-sm text-muted" role="status">{feedback}</p>
				{/if}
			</div>
		</form>
	{/if}
</div>
