export const load = ({ locals }) => {
        const user = locals.user;
        return { user: user?.get() };
}

