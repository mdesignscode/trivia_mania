import { redirect, type Cookies } from "@sveltejs/kit";
import { validateSessionToken } from "./session";

// check if user is already logged in
export const isSignedIn = async (token: string | undefined, route: string) => {
        // don't redirect auth pages
        const isAuthRoute = ['/login', '/signup'].includes(route);
        if (!token && isAuthRoute) return;

        // user not logged in
        if (!token) throw redirect(302, '/login');

        const { user } = await validateSessionToken(token);
        // user signed in
        if (user) throw redirect(302, '/');

        // no user
        if (!user && isAuthRoute) return;
        else throw redirect(302, '/login');
}

export const getUser = async (cookies: Cookies) => {
        const token = cookies.get('session');
        if (!token) {
                throw redirect(302, '/login');
        }

        const { session, user } = await validateSessionToken(token);
        if (!session || !user) {
                throw redirect(302, '/login');
        }

        const userData = user.dataValues;
        delete userData.password;

        return {
                user: userData,
        };
}

