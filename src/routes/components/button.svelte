<script lang="ts">
        let { primary, cta, play, showCategories, children, type } = $props();

        const color = "#ffcb74";
        const dark = "#2f2f2f";
        const light = "#f6f6f6";

        // Dynamic classes
        const classes = [
                'base',
                primary && 'primary',
                cta && 'cta',
                showCategories && 'show-categories',
                play && 'play',
        ]
                .filter(Boolean)
                .join(' ');

</script>

<button {type} class={classes} style={
        showCategories
        ? `--category-border-color: ${primary ? light : dark}; --category-hover-color: ${primary ? dark : light};`
        : ''
}>
        {@render children()}
</button>

<style>
        :global(button) {
                font-family: inherit;
        }

        button.base {
                background: transparent;
                border-radius: 5px;
                border: 2px solid #ffcb74;
                padding: 0.25em;
                transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        button.base:hover {
                background-color: #ffcb74;
                color: white;
        }

        @media (prefers-color-scheme: dark) {
                button.base:hover {
                        color: #2f2f2f;
                }
        }

        /* Primary */
        button.primary {
                background: #ffcb74;
                color: white;
        }

        button.primary:hover {
                border-color: #2f2f2f;
                background: transparent;
                color: #2f2f2f;
        }

        @media (prefers-color-scheme: dark) {
                button.primary {
                        color: #2f2f2f;
                }

                button.primary:hover {
                        border-color: #f6f6f6;
                        color: #f6f6f6;
                }
        }

        /* CTA */
        button.cta {
                color: #f6f6f6;
                border: 2px solid #ffcb74;
                padding: 0.75rem;
                letter-spacing: 2px;
                min-width: 160px;
                height: 48px;
                text-transform: uppercase;
                white-space: normal;
                font-weight: 700;
                margin-top: 1.25rem;
                display: inline-block;
                background-color: #ffcb74;
        }

        button.cta:hover {
                background-color: transparent;
                color: #2f2f2f;
                border-color: #2f2f2f;
                border-radius: 500px;
        }

        @media (prefers-color-scheme: dark) {
                button.cta {
                        color: #2f2f2f;
                }

                button.cta:hover {
                        border-color: #f6f6f6;
                        color: #f6f6f6;
                }

                button.cta.play:hover {
                        border-color: #2f2f2f;
                        color: #2f2f2f;
                }
        }

        /* Show categories modifier */
        button.show-categories {
                border-color: var(--category-border-color);
        }

        button.show-categories:hover {
                border-color: var(--category-hover-color);
        }
</style>

