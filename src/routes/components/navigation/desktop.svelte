<script lang="ts">
	import { globalStore } from 'store';
	import { createDisclosure } from 'svelte-headlessui';
	import { Bars3, ChartBar, UserCircle, XMark, Icon } from 'svelte-hero-icons';
	import { page } from '$app/state';
	import { navStyles } from '.';

	let { navigation, disabledLink } = $props();
</script>

<nav class="hidden w-full items-center bg-secondary px-2 text-light md:flex">
	<a class={['ml-1 mr-auto rounded-md px-3 py-2 text-xl hover:bg-gray-700', disabledLink]} href="/">
		Trivia Mania
	</a>

	<div class="flex gap-1 px-2">
		{#each navigation as item}
			<a
				data-testid={item.name}
				href={item.href}
				class={[
					item.href.split('?')[0] === page.url.pathname ? navStyles.active : navStyles.inActive[0],
					navStyles.inActive[1],
					disabledLink
				]}
				aria-current={item.href === page.url.pathname ? 'page' : undefined}
			>
				<Icon src={item.icon} size="25" />
				{item.name}
			</a>
		{/each}

		{#if globalStore.user}
			<a
				data-testid="your-stats-button"
				href={`/stats`}
				class={[
					`/stats` === page.url.pathname ? navStyles.active : navStyles.inActive[0],
					navStyles.inActive[1],
					disabledLink
				]}
				aria-current={`/stats` === page.url.pathname ? 'page' : undefined}
			>
				<Icon src={ChartBar} size="25" />
				Your Stats
			</a>

			<a
				href={`/settings`}
				class={[
					`/settings` === page.url.pathname ? navStyles.active : navStyles.inActive[0],
					navStyles.inActive[1],
					'-ml-2 px-1',
					disabledLink
				]}
				aria-current={`/settings` === page.url.pathname ? 'page' : undefined}
			>
				<img class="size-8 rounded-full" src={globalStore.user?.avatar} alt="User icon" />
			</a>
		{/if}
	</div>
</nav>
