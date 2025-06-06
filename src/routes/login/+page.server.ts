import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { User } from 'models';
import { isSignedIn } from 'currentUser';
import { createSession, generateSessionToken } from 'utils/session';

export const load: PageServerLoad = async ({ cookies }) => {
        const token = cookies.get('session');
        return await isSignedIn(token, '/login');
}

export const actions: Actions = {
        default: async ({ request, cookies }) => {
                const form = await request.formData();
                const email = form.get('username');
                const password = form.get('password') as string;

                if (!email || !password) {
                        return fail(400, { error: 'Missing email or password.' });
                }

                const user = await User.findOne({
                        where: { email },
                });

                if (!user) {
                        return fail(400, { error: 'Invalid email or password.' });
                }

                const validPassword = await bcrypt.compare(password, user.getDataValue('password'));
                if (!validPassword) {
                        return fail(400, { error: 'Invalid email or password.' });
                }

                const token = generateSessionToken();
                await createSession(token, user.getDataValue('id'));

                cookies.set('session', token, {
                        path: '/',
                        httpOnly: true,
                        sameSite: 'strict',
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 60 * 60 * 24 * 30
                });

                const userData = user.dataValues;
                delete userData.password;
                return userData;
        }
};

