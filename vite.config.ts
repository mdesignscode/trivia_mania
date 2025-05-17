import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import autoprefixer from 'autoprefixer';

export default defineConfig({
        plugins: [sveltekit()],
        css: {
                postcss: {
                        plugins: [
                                autoprefixer() // only autoprefixer, no lightningcss
                        ]
                }
        },
        server: {
                host: true
        }
});

