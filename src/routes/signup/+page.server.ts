import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { isSignedIn } from 'currentUser';
import { User } from 'models';
import { sendEmail } from 'utils/emailVerification';
import { createSession, generateSessionToken } from 'utils/session';

export const load: PageServerLoad = async ({ cookies }) => {
        const token = cookies.get('session');
        return isSignedIn(token, '/signup');
}

export const actions: Actions = {
        default: async ({ request, cookies }) => {
                const formData = await request.formData();
                const username = formData.get('username')?.toString().trim();
                const email = formData.get('email')?.toString();
                const password = formData.get('password')?.toString();

                if (!username || !password || !email) {
                        return fail(400, { error: 'Username, email and password are required.' });
                }

                // check for existing user
                const existingUser = await User.findOne({
                        where: {
                                username
                        }
                });

                if (existingUser) {
                        return fail(400, { error: 'Username already taken.' });
                }

                // hash password and save user in db
                const hashedPassword = await bcrypt.hash(password, 10);
                const avatar = '/images/icons8-user-64.png';

                const newUser = await User.create({
                        username, password: hashedPassword, email, correctAnswered: 0, answeredQuestions: [], avatar,
                });

                // sign user in
                const token = generateSessionToken();
                createSession(token, newUser.getDataValue("id"));

                cookies.set('session', token, {
                        path: '/',
                        httpOnly: true,
                        sameSite: 'strict',
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 60 * 60 * 24 * 30
                });

                const { status, data } = await sendEmail({ email, username });

                if (status === 'fail') return fail(500, { error: data })

                const validateEmailUri = `/signup/validate-email?email=${email}`;

                const userData = newUser.dataValues;
                delete userData.password;

                return { user: userData, redirectTo: validateEmailUri, message: 'Account created' };
        }
};

