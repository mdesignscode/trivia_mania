type TUser = {
        id: string,
        isVerified: boolean,
        username: string,
        email: string,
        avatar: string,
        answeredQuestions: string[]
}
type TGlobalStore = {
        user: TUser | null,
        difficulty: string,
        categories: string[],
};
const globalStore = $state<TGlobalStore>({
        user: null,
        difficulty: '',
        categories: [],
});

export default globalStore;

