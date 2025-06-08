<script lang="ts">
        import SpinningLoader from 'components/spinningLoader.svelte';
        import Button from 'components/button.svelte'
        import { enhance } from '$app/forms';
        import { goto } from '$app/navigation';
        import { onMount } from 'svelte';

        let difficulty = $state('');

        let { allDifficulties, allCategories } = $props();
        let loading = $state(false);
        let selectedCategories = $state([]);
        let filteredCategories = $state([]);

        onMount(() => {
                difficulty = localStorage.getItem('difficulty') || '';
                const localSelectedCategories = localStorage.getItem('selectedCategories') || '';
                selectedCategories = localSelectedCategories ? localSelectedCategories.split(',') : [];
                if (difficulty) {
                        filteredCategories = Object
                                .values(allCategories)
                                .map(value => value[difficulty]);
                }
        });

        const handleSelectCategory = (category: string) => {
                selectedCategories = selectedCategories.includes(category)
                        ? selectedCategories.filter(cat => cat !== category)
                        : [...selectedCategories, category]
        }

        const handleSetDifficulty = (diff) => {
                if (diff && typeof diff === 'string') {
                        difficulty = diff;
                        localStorage.setItem('difficulty', difficulty);
                }
                filteredCategories = Object
                        .values(allCategories)
                        .map(value => value[difficulty]);
        }

        const handlePlay = () => {
                const playUri = `/play?difficulty=${difficulty}&categories=${selectedCategories.join(',')}`;
                localStorage.setItem('difficulty', difficulty);
                localStorage.setItem('selectedCategories', selectedCategories.join(','));
                goto(playUri);
        }
</script>

{#snippet difficultiesBox()}
        <div class="flex gap-2">
                {#each [...allDifficulties, 'all difficulties'] as diff}
                        <Button
                                nativeProps={{
                                        onclick: filteredCategories.length
                                                ? () => handleSetDifficulty(diff)
                                                : () => difficulty = diff,
                                        class: [
                                                diff === difficulty && 'primary',
                                                filteredCategories.length && 'show-categories'
                                        ],
                                }}
                        >
                                {diff}
                        </Button>
                {/each}
        </div>
{/snippet}

<section class="h-full">
        {#if !filteredCategories.length}
                <div class="h-full col items-center justify-center gap-3">
                        <p>Choose a difficulty to continue</p>

                        {@render difficultiesBox()}

                        <Button
                                nativeProps={{
                                        disabled: !difficulty || loading,
                                        onclick: handleSetDifficulty,
                                }}
                        >
                                Continue
                                {#if loading}
                                        <SpinningLoader size="8" />
                                {/if}
                        </Button>
                </div>
        {:else}
                <div class="col h-full overflow-y-hidden">
                        <div class="grid place-content-center bg-accent border-b-lg py-6 gap-2">
                                {@render difficultiesBox()}
                                <Button play nativeProps={{ disabled: !selectedCategories.length, onclick: handlePlay }}>Play</Button>
                        </div>

                        <div class="col gap-4 items-center ustify-center flex-1 overflow-y-auto px-2 py-4">
                                <div class="flex justify-center flex-wrap gap-2">
                                        {#each filteredCategories as { category, count }}
                                                <Button
                                                        nativeProps={{
                                                                onclick: () => handleSelectCategory(category),
                                                                class: selectedCategories.includes(category)
                                                                        ? 'primary'
                                                                        : ''
                                                        }}
                                                >{category} ({count})</Button>
                                        {/each}
                                </div>

                                <Button nativeProps={{
                                        onclick: () => selectedCategories = [],
                                        disabled: !selectedCategories.length
                                }}>
                                        Reset
                                </Button>
                        </div>
                </div>
        {/if}
</section>

