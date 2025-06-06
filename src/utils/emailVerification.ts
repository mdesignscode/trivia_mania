import { env } from '$env/dynamic/private';
import { EmailVerification } from '../models';
import nodemailer from 'nodemailer';

const sender = env.EMAIL_ADDRESS;
const pass = env.EMAIL_CODE;

// Configure the transporter
const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // e.g. smtp.gmail.com
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
                user: sender,
                pass,
        },
});

// Send email function
export const sendEmail = async ({ email, username }: { username: string, email: string }) => {
        // generate email verification code
        const code = await generateEmailVerificationCode(email);

        // email body
        const textBody = `<p>Hi ${username},</p>
    <p>Thank you for signing up with <strong>Trivia Mania</strong>! To complete your registration, please use the verification code below:</p>
    <div class="code-box">${code}</div>
    <p>This code will expire in <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email.</p>
    <p>Need help? <a href="mailto:${sender}">Contact our support team</a>.</p>
    <div class="footer">
      &copy; 2025 Trivia Mania. All rights reserved.
      <br>
      <a href="https://triviamania.vercel.app">https://triviamania.vercel.app</a>
    </div>`

        try {
                // send email
                await transporter.sendMail({
                        from: '"Trivia Mania" ejue1vs7n@mozmail.com', // sender address
                        to: email, // list of receivers
                        subject: 'Verify Your Email Address', // Subject line
                        html: textBody, // HTML body
                });

                return { status: 'success', data: code };
        } catch (error) {
                console.error('Error sending email:', error);
                return { status: 'fail', data: error.message };
        }
};


export async function generateEmailVerificationCode(email: string): Promise<string> {
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // existing verification should be updated
        const existingVerification = await EmailVerification.findOne({
                where: { email },
        });

        if (existingVerification) {
                existingVerification.setDataValue('code', code);
                existingVerification.setDataValue('expiresAt', expiresAt);
                await existingVerification.save();
                return code;
        }

        await EmailVerification.create({
                email,
                code,
                expiresAt,
                used: false,
        });

        return code;
}

export async function validateEmailVerificationCode(email: string, inputCode: string): Promise<{ success: boolean; message: string }> {
        const record = await EmailVerification.findOne({
                where: {
                        email,
                },
        });

        const failedResponse = { success: false, message: 'Invalid or expired verification code.' };

        if (record) {
                // if code hasn't expired yet
                const codeExpired = record.getDataValue('expiresAt') < new Date();
                if (codeExpired) return failedResponse;

                // is code correct
                const code = record.getDataValue('code');
                if (code !== inputCode) return failedResponse;

                // verified
                record.setDataValue('used', true)
                await record.save();

                return { success: true, message: 'Verification successful.' };
        }

        // record not found
        return failedResponse;
}

