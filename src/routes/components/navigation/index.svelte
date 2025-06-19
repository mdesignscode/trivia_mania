<script lang="ts">
        import { Home, PuzzlePiece, Star } from 'svelte-hero-icons';
        import { globalStore, questionStore } from 'store';
	import MobileNav from './mobile.svelte';
	import DesktopNav from './desktop.svelte';

        let navigation = $derived([
                { name: 'Home', href: '/', icon: Home },
                {
                        name: 'Play',
                        href: `/play?difficulty=${globalStore.difficulty}&categories=${globalStore.categories}`,
                        icon: PuzzlePiece
                },
                {
                        name: 'Score Board',
                        href: '/scoreboard',
                        icon: Star
                }
        ]);

        let questionStarted = $derived(questionStore.timers.some(s => s.state === 'started'));
        const disabledLink = $derived(questionStarted && "pointer-events-none opacity-50");
</script>

<MobileNav {questionStarted} {navigation} {disabledLink} />
<DesktopNav {navigation} {disabledLink} />

