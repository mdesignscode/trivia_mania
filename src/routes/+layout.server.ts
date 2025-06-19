import { getUser } from 'currentUser';

export const load = async ({ cookies, url }) => {
        const user = await getUser(cookies, url.pathname);
        if (user) return { user: user.get() };
}

