<script lang="ts">
	import { globalStore } from 'store';
	import { ChartBar, ArrowRightOnRectangle, Icon } from 'svelte-hero-icons';
	import { page } from '$app/state';
	import { navStyles, isActive } from '.';

	let { navigation, disabledLink } = $props();
</script>

<nav aria-label="Main" class="hidden h-16 items-center gap-6 bg-rail px-6 shadow-[0_2px_12px_rgb(0_0_0/0.35)] md:flex">
	<a
		class={['mr-auto font-display text-2xl font-extrabold uppercase tracking-wide text-chalk', disabledLink]}
		href="/"
	>
		Trivia <span class="text-amber">Mania</span>
	</a>

	<div class="flex items-center gap-1">
		{#each navigation as item}
			{@const active = isActive(item.href, page.url.pathname)}
			<a
				data-testid={item.name}
				href={item.href}
				class={[navStyles.base, active ? navStyles.active : navStyles.inactive, disabledLink]}
				aria-current={active ? 'page' : undefined}
			>
				<Icon src={item.icon} size="20" />
				{item.name}
			</a>
		{/each}

		{#if globalStore.user}
			{@const active = isActive('/stats', page.url.pathname)}
			<a
				data-testid="your-stats-button"
				href="/stats"
				class={[navStyles.base, active ? navStyles.active : navStyles.inactive, disabledLink]}
				aria-current={active ? 'page' : undefined}
			>
				<Icon src={ChartBar} size="20" />
				Your Stats
			</a>

			<a
				href="/settings"
				class={['ml-2 rounded-full ring-2 transition', isActive('/settings', page.url.pathname) ? 'ring-amber' : 'ring-chalk/30 hover:ring-chalk/70', disabledLink]}
				aria-label="Account settings"
				aria-current={isActive('/settings', page.url.pathname) ? 'page' : undefined}
			>
				<img class="size-9 rounded-full object-cover" src={globalStore.user?.avatar} alt="" />
			</a>
		{:else}
			<a href="/login" class={[navStyles.base, 'ml-2 bg-amber text-ink hover:bg-amber-hi', disabledLink]}>
				<Icon src={ArrowRightOnRectangle} size="20" />
				Sign in
			</a>
		{/if}
	</div>
</nav>
