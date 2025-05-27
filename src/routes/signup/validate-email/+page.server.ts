import { redirect, fail } from '@sveltejs/kit';
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

                const { success, message } = await validateEmailVerificationCode(email, code);

                if (success) {
                        const user = await User.findOne({
                                where: { email }
                        });
                        user?.setDataValue('isVerified', true);
                        await user?.save();
                        throw redirect(302, '/');
                }
                else return fail(400, { error: message })
        },
        resendCode: async ({ request }) => {
                const formData = await request.formData();
                const email = formData.get('email')?.toString();
                const user = await User.findOne({
                        where: { email }
                });

                if (!user) throw redirect(302, '/signup');

                const { status, data } = await sendEmail({ username: user.getDataValue('username'), email })
                if (status === 'fail') return fail(400, { error: data })
        },
};

