import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { User } from 'models';
import { createSession, generateSessionToken } from 'utils/session';

export const load: PageServerLoad = async ({ locals }) => {
        console.log('[load: /login] logging in...')
        const user = locals.user;
        if (user) {
                console.log('[load: /login] user found, redirecting to /')
                throw redirect(302, '/');
        }
};

export const actions: Actions = {
        default: async ({ request, cookies }) => {
                console.log('[action: /login] logging in...')
                const form = await request.formData();
                const email = form.get('email');
                const password = form.get('password') as string;

                if (!email || !password) {
                        return fail(400, { error: 'Missing email or password.' });
                }

                const user = await User.findOne({ where: { email } });

                if (!user) {
                        console.log('[action: /login] user not found')
                        return fail(400, { error: 'Invalid email or password.' });
                }

                const validPassword = bcrypt.compare(password, user.get('password'));

                if (!validPassword) {
                        console.log('[action: /login] invalid password')
                        return fail(400, { error: 'Invalid email or password.' });
                }

                const token = generateSessionToken();
                console.log('[action: /login] session token:', token)
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

