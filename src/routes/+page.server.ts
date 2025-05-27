import { getUser } from 'currentUser';

export const load = async ({ cookies }) => {
        return await getUser(cookies);
}

