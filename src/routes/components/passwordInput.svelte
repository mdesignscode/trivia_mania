<script>
	import { Icon, Eye, EyeSlash } from 'svelte-hero-icons';

        let { show, value, name, placeholder, label } = $props();
</script>

<div class="relative w-full">
        <input
                required
                class="rounded-sm w-full"
                style="padding-right: 40px !important;"
                type={show ? "text" : "password"}
                bind:value={value}
                {name}
                {placeholder}
        />
        <button
                type="button"
                class="dark:text-dark absolute right-2 top-1/2 -translate-y-1/2"
                aria-label={label}
                onclick={() => show = !show}
        >
                {#if show}
                        <Icon src={EyeSlash} size="25" />
                {:else}
                        <Icon src={Eye} size="25" />
                {/if}
        </button>
</div>

