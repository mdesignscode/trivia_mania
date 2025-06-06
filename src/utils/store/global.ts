import { writable } from "svelte/store";

const globalStore = writable({
        user: null,
});

export default globalStore;

