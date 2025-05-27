import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
        plugins: [sveltekit()],
        server: {
                allowedHosts: ["2a09-41-13-0-38.ngrok-free.app" /* ngrok tunnel */]
        }
});

