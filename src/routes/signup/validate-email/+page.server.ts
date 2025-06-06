import { redirect, fail } from '@sveltejs/kit';
import { getUserByName } from 'currentUser';
import { User } from 'models';
import { sendEmail, validateEmailVerificationCode } from 'utils/emailVerification';

export const load = async ({ url }) => {
        const email = url.searchParams.get('email');
        const user = await User.findOne({
                where: { email }
        });

        if (!user) throw redirect(302, '/login');
        if (user.getDataValue('isVerified')) throw redirect(302, '/');
        return { email }
}

export const actions = {
        verifyCode: async ({ request }) => {
                const formData = await request.formData();
                const code = formData.get('code')?.toString();
                const email = formData.get('email')?.toString();
                const username = formData.get('username')?.toString();

                if (!username) return fail(400, { error: 'Missing username' });
                if (!code) return fail(400, { error: 'Missing verification code' });

                const { success, message } = await validateEmailVerificationCode(email, code);

                if (success) {
                        const user = await getUserByName(username);
                        user.setDataValue('isVerified', true);
                        await user.save();
                        return {
                                message: 'Email verified',
                                user: user.dataValues,
                                redirectTo: '/',
                        };
                }
                else return fail(400, { error: message })
        },
        resendCode: async ({ request }) => {
                const formData = await request.formData();
                const email = formData.get('email')?.toString();
                const user = await User.findOne({
                        where: { email },
                        attributes: {
                                exclude: ['password'],
                        }
                });

                if (!user) throw redirect(302, '/signup');

                const { status, data } = await sendEmail({ username: user.getDataValue('username'), email })
                if (status === 'fail') return fail(400, { error: data })
                return { user: user.dataValues, message: 'New code sent' };
        },
        changeEmail: async ({ request }) => {
                const formData = await request.formData();
                const username = formData.get('username')?.toString();
                const newEmail = formData.get('newEmail')?.toString();

                if (!newEmail) return fail(400, { error: 'Missing new email' });
                if (!username) return fail(400, { error: 'Missing username' });

                const validateEmailUri = `/signup/validate-email?email=${newEmail}`;

                const user = await getUserByName(username);
                user.setDataValue('email', newEmail);
                await user.save();
                return {
                        message: 'Email updated',
                        user: user.dataValues,
                        redirectTo: validateEmailUri,
                        newEmail,
                };
        }
};

