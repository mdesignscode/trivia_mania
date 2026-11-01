import { redirect, fail } from '@sveltejs/kit';
import { User } from 'models';
import { sendEmail, validateEmailVerificationCode } from 'utils/emailVerification';

export const load = async ({ locals }) => {
        // only ever the logged-in user's own address, never one from the URL
        const user = locals.user;
        if (!user) throw redirect(302, '/login');
        if (user.get('isVerified')) throw redirect(302, '/');
        return { email: user.get('email') }
}

export const actions = {
        verifyCode: async ({ request, locals }) => {
                const user = locals.user;
                if (!user) redirect(302, '/login');

                const formData = await request.formData();
                const code = formData.get('code')?.toString();

                if (!code) return fail(400, { error: 'Missing verification code' });

                const { success, message } = await validateEmailVerificationCode(user.get('email'), code);

                if (success) {
                        user.setDataValue('isVerified', true);
                        await user.save();
                        return {
                                message: 'Email verified',
                                user: user.get(),
                                redirectTo: '/',
                        };
                }
                else return fail(400, { error: message })
        },
        resendCode: async ({ locals }) => {
                const user = locals.user;
                if (!user) throw redirect(302, '/login');

                const { status, data } = await sendEmail({ username: user.get('username'), email: user.get('email') })
                if (status === 'fail') return fail(400, { error: data })
                return { user: user.get(), message: 'New code sent' };
        },
        changeEmail: async ({ request, locals }) => {
                const user = locals.user;
                if (!user) throw redirect(302, '/login');

                const formData = await request.formData();
                // emails are stored lowercase (see the User model)
                const newEmail = formData.get('newEmail')?.toString().trim().toLowerCase();

                if (!newEmail) return fail(400, { error: 'Missing new email' });

                const owner = await User.findOne({ where: { email: newEmail } });
                if (owner && owner.get('id') !== user.get('id')) {
                        return fail(400, { error: 'That email is already in use.' });
                }

                user.setDataValue('email', newEmail);
                await user.save();

                const { status, data } = await sendEmail({ username: user.get('username'), email: newEmail });
                if (status === 'fail') return fail(500, { error: data });

                const validateEmailUri = `/signup/validate-email?email=${encodeURIComponent(newEmail)}`;
                return {
                        message: 'Email updated',
                        user: user.get(),
                        redirectTo: validateEmailUri,
                        newEmail,
                };
        }
};

