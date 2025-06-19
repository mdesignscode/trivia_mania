<script lang="ts">
	import { globalStore } from 'store';
	import { createDisclosure } from 'svelte-headlessui';
	import { Bars3, ChartBar, UserCircle, XMark, Icon } from 'svelte-hero-icons';
	import { page } from '$app/state';
	import { navStyles } from '.';

	let { navigation, questionStarted, disabledLink } = $props();
	const navbar = createDisclosure({ expanded: false });
</script>

<nav class="text-light md:hidden">
	{#if $navbar.expanded}
		<div class="absolute left-0 top-0 z-40 h-screen w-full bg-dark/80"></div>
	{/if}

	<div class="relative z-50 flex bg-secondary dark:bg-accent-100">
		<button
			disabled={questionStarted}
			use:navbar.button
			data-testid="disclosure-button"
			class="relative inline-flex items-center justify-center rounded-md px-4 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white disabled:opacity-50"
		>
			<span class="sr-only">Open main menu</span>
			{#if $navbar.expanded}
				<Icon src={XMark} class="block h-6 w-6" aria-hidden="true" />
			{:else}
				<Icon src={Bars3} class="block h-6 w-6" aria-hidden="true" />
			{/if}
		</button>

		<a class={['flex-1 rounded-md px-3 py-1 text-center hover:bg-gray-700', disabledLink]} href="/">
			<h1 class="text-2xl text-white">Trivia Mania</h1>
		</a>
	</div>

	{#if $navbar.expanded}
		<div
			use:navbar.panel
			class={[
				'absolute z-50 w-full space-y-1 bg-secondary px-2 pb-3 pt-2 transition-all',
				$navbar.expanded ? 'h-auto opacity-100' : 'h-0 opacity-0'
			]}
		>
			{#each navigation as item}
				<a
					use:navbar.button
					data-testid={item.name}
					href={item.href}
					class={[
						item.href.split('?')[0] === page.url.pathname
							? navStyles.active
							: navStyles.inActive[0],
						navStyles.inActive[1]
					]}
					aria-current={item.href === page.url.pathname ? 'page' : undefined}
				>
					<Icon src={item.icon} size="25" />
					{item.name}
				</a>
			{/each}

			<!-- User stats and User button -->
			<div class="col">
				{#if globalStore.user}
					<a
						use:navbar.button
						data-testid="your-stats-button"
						href={`/stats`}
						class={[
							`/stats` === page.url.pathname ? navStyles.active : navStyles.inActive[0],
							navStyles.inActive[1]
						]}
						aria-current={`/stats` === page.url.pathname ? 'page' : undefined}
					>
						<Icon src={ChartBar} size="25" />
						Your Stats
					</a>

					<a
						use:navbar.button
						href={`/settings`}
						class={[
							`/settings` === page.url.pathname ? navStyles.active : navStyles.inActive[0],
							navStyles.inActive[1],
							'-ml-2'
						]}
						aria-current={`/settings` === page.url.pathname ? 'page' : undefined}
					>
						<img class="size-10 rounded-full" src={globalStore.user?.avatar} alt="User icon" />
						Settings
					</a>
				{/if}
			</div>
		</div>
	{/if}
</nav>
