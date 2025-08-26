import type { TUserAttributes } from "models";

type TGlobalStore = {
        user: TUserAttributes | null,
        difficulty: string,
        categories: string[],
};
const globalStore = $state<TGlobalStore>({
        user: null,
        difficulty: '',
        categories: [],
});

export default globalStore;

