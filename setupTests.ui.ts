import { globalStore } from "utils/store";

beforeEach(() => {
        localStorage.clear();

        // reset gobal store
        globalStore.difficulty = '';
        globalStore.categories = [];
        globalStore.user = null;
});

