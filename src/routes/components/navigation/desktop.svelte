<script lang="ts">
        import { globalStore } from 'store';
        import { createDisclosure } from "svelte-headlessui";
        import {
                Bars3,
                ChartBar,
                UserCircle,
                XMark,
                Icon,
        } from "svelte-hero-icons";
        import { navStyles, navigation } from ".";

        let { path } = $props();
</script>

<nav class="hidden items-center md:flex text-light bg-secondary px-2 w-full">
        <a class="hover:bg-gray-700 rounded-md mr-auto text-xl ml-1 px-3 py-2" href="/">Trivia Mania</a>

        <div class="flex px-2 gap-1">
                {#each navigation as item}
                        <a
                                data-testid={item.name}
                                href={item.href}
                                class={[
                                        item.href.split("?")[0] === path
                                                ? navStyles.active
                                                : navStyles.inActive[0],
                                        navStyles.inActive[1]
                                ]}
                                aria-current={item.href === path ? "page" : undefined}
                        >
                                <Icon src={item.icon} size="25" />
                                {item.name}
                        </a>
                {/each}

                <!-- User stats and User button -->
                {#if $globalStore.user}
                        <a
                                data-testid="your-stats-button"
                                href={`/stats`}
                                class={[
                                        `/stats` === path
                                                ? navStyles.active
                                                : navStyles.inActive[0],
                                        navStyles.inActive[1]
                                ]}
                                aria-current={`/stats` === path ? "page" : undefined}
                        >
                                <Icon src={ChartBar} size="25" />
                                Your Stats
                        </a>

                        <a
                                href={`/settings`}
                                class={[
                                        `/settings` === path
                                                ? navStyles.active
                                                : navStyles.inActive[0],
                                        navStyles.inActive[1],
                                        "-ml-2 px-1"
                                ]}
                                aria-current={`/settings` === path ? "page" : undefined}
                        >
                                <img class="size-8 rounded-full" src={$globalStore.user?.avatar} alt="User icon" />
                        </a>
                {/if}
        </div>
</nav>

