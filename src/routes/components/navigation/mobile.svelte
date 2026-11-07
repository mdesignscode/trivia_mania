<script lang="ts">
	import { globalStore } from 'store';
	import { createDisclosure } from 'svelte-headlessui';
	import { Bars3, ChartBar, Cog6Tooth, ArrowRightOnRectangle, XMark, Icon } from 'svelte-hero-icons';
	import { page } from '$app/state';
	import { navStyles, isActive } from '.';

	let { navigation, questionStarted, disabledLink } = $props();
	const navbar = createDisclosure({ expanded: false });
</script>

<nav aria-label="Main" class="relative md:hidden">
	{#if $navbar.expanded}
		<div class="fixed inset-0 z-40 bg-ink/70" aria-hidden="true"></div>
	{/if}

	<div class="relative z-50 flex h-14 items-center bg-rail px-2 shadow-[0_2px_12px_rgb(0_0_0/0.35)]">
		<button
			disabled={questionStarted}
			use:navbar.button
			data-testid="disclosure-button"
			class="inline-flex size-11 items-center justify-center rounded text-chalk hover:bg-ink/25 disabled:opacity-40"
		>
			<span class="sr-only">{$navbar.expanded ? 'Close' : 'Open'} main menu</span>
			<Icon src={$navbar.expanded ? XMark : Bars3} class="size-6" aria-hidden="true" />
		</button>

		<a
			class={['flex-1 text-center font-display text-2xl font-extrabold uppercase tracking-wide text-chalk', disabledLink]}
			href="/"
		>
			Trivia <span class="text-amber">Mania</span>
		</a>

		<span class="size-11" aria-hidden="true"></span>
	</div>

	{#if $navbar.expanded}
		<div use:navbar.panel class="absolute z-50 w-full space-y-1 border-b border-line bg-rail px-2 pb-3 pt-1">
			{#each navigation as item}
				{@const active = isActive(item.href, page.url.pathname)}
				<a
					use:navbar.button
					data-testid={item.name}
					href={item.href}
					class={[navStyles.base, active ? navStyles.active : navStyles.inactive]}
					aria-current={active ? 'page' : undefined}
				>
					<Icon src={item.icon} size="22" />
					{item.name}
				</a>
			{/each}

			{#if globalStore.user}
				{@const statsActive = isActive('/stats', page.url.pathname)}
				{@const settingsActive = isActive('/settings', page.url.pathname)}
				<a
					use:navbar.button
					data-testid="your-stats-button"
					href="/stats"
					class={[navStyles.base, statsActive ? navStyles.active : navStyles.inactive]}
					aria-current={statsActive ? 'page' : undefined}
				>
					<Icon src={ChartBar} size="22" />
					Your Stats
				</a>
				<a
					use:navbar.button
					href="/settings"
					class={[navStyles.base, settingsActive ? navStyles.active : navStyles.inactive]}
					aria-current={settingsActive ? 'page' : undefined}
				>
					<Icon src={Cog6Tooth} size="22" />
					Settings
				</a>
			{:else}
				<a use:navbar.button href="/login" class={[navStyles.base, navStyles.inactive]}>
					<Icon src={ArrowRightOnRectangle} size="22" />
					Sign in
				</a>
			{/if}
		</div>
	{/if}
</nav>
