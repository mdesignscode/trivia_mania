import { db } from '$lib/db';
import { generateSessionToken, createSession } from '$lib/session';
import { redirect, fail, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const actions: Actions = {
        default: async ({ request, cookies }) => {
                const formData = await request.formData();
                const username = formData.get('username')?.toString();
                const password = formData.get('password')?.toString();

                if (!username || !password) {
                        return fail(400, { error: 'Username and password are required.' });
                }

                const existingUser = db.prepare('SELECT * FROM user WHERE username = ?').get(username);
                if (existingUser) {
                        return fail(400, { error: 'Username already taken.' });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const result = db.prepare('INSERT INTO user (username, password) VALUES (?, ?)').run(username, hashedPassword);
                const userId = result.lastInsertRowid as number;

                const token = generateSessionToken();
                createSession(token, userId);

                cookies.set('session', token, {
                        path: '/',
                        httpOnly: true,
                        sameSite: 'strict',
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 60 * 60 * 24 * 30
                });

                throw redirect(302, '/protected');
        }
};

