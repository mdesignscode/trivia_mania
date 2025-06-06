import { getUser } from 'currentUser';

export const load = async ({ cookies, url }) => {
        return await getUser(cookies, url.pathname);
}

