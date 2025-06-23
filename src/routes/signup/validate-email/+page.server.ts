import { redirect, fail } from '@sveltejs/kit';
import { User } from 'models';
import { sendEmail, validateEmailVerificationCode } from 'utils/emailVerification';

export const load = async ({ url, locals }) => {
        const sessionUser = locals.user;
        if (!sessionUser) throw redirect(302, '/login');

        const email = url.searchParams.get('email');
        const user = await User.findOne({
                where: { email }
        });

        if (!user) throw redirect(302, '/login');
        if (user.get('isVerified')) throw redirect(302, '/');
        return { email }
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
                const newEmail = formData.get('newEmail')?.toString();

                if (!newEmail) return fail(400, { error: 'Missing new email' });

                const validateEmailUri = `/signup/validate-email?email=${newEmail}`;

                user.setDataValue('email', newEmail);
                await user.save();
                return {
                        message: 'Email updated',
                        user: user.get(),
                        redirectTo: validateEmailUri,
                        newEmail,
                };
        }
};

