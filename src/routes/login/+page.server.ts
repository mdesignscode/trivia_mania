import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { User } from 'models';
import { createSession, generateSessionToken } from 'utils/session';

export const load: PageServerLoad = async ({ locals }) => {
        const user = locals.user;
        if (user) {
                throw redirect(302, '/');
        }
};

export const actions: Actions = {
        default: async ({ request, cookies }) => {
                const form = await request.formData();
                const email = form.get('email');
                const password = form.get('password') as string;

                if (!email || !password) {
                        return fail(400, { error: 'Missing email or password.' });
                }

                const user = await User.findOne({ where: { email } });

                if (!user) {
                        return fail(400, { error: 'Invalid email or password.' });
                }

                const validPassword = bcrypt.compare(password, user.get('password'));

                if (!validPassword) {
                        return fail(400, { error: 'Invalid email or password.' });
                }

                const token = generateSessionToken();
                await createSession(token, user.get('id'));

                cookies.set('session', token, {
                        path: '/',
                        httpOnly: true,
                        sameSite: 'strict',
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 60 * 60 * 24 * 30 // 30 days
                });

                const userData = user.get();
                delete userData.password;

                return { user: userData };
        }
};

