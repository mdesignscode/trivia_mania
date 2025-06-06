import { redirect, type Cookies } from "@sveltejs/kit";
import { validateSessionToken } from "./session";
import { User } from "models";

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

export const getUser = async (cookies: Cookies, route: string) => {
        const isAuthRoute = ['/login', '/signup'].includes(route);
        const token = cookies.get('session');

        // in auth process
        if (isAuthRoute && !token) return;
        // no signed in user
        if (!token) {
                throw redirect(302, '/login');
        }

        const { session, user } = await validateSessionToken(token);

        // token invalid, and at auth page
        if ((!session || !user) && isAuthRoute) return;

        // token invalid
        if (!session || !user)
                throw redirect(302, '/login');

        // check if user email verified
        const isVerifyEmailRoute = route.includes('validate-email');
        const isVerifiedUser = user.getDataValue('isVerified');
        const validateEmailUri = `/signup/validate-email?email=${user.getDataValue('email')}`;

        // needs to verify email
        if (!isVerifiedUser && !isVerifyEmailRoute)
                throw redirect(302, validateEmailUri);

        // user authenticated
        const userData = user.dataValues;
        delete userData.password;

        return {
                user: userData,
        };
}

export const getUserByName = async (username: string | undefined, getPassword: boolean = false) => {
        const user = await User.findOne({
                where: { username },
                attributes: {
                        exclude: [getPassword ? '' : 'password'],
                }
        });

        if (!user) throw redirect(302, '/login');
        return user
}

