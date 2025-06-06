<script lang="ts">
        import MobileNav from './mobile.svelte';
        import DesktopNav from './desktop.svelte';

        let { path } = $props();

        const playUrl = 'some/url';
</script>

<MobileNav {path} />
<DesktopNav {path} />

