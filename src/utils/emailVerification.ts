import { randomInt } from 'crypto';
import { env } from '$env/dynamic/private';
import { EmailVerification } from '../models';
import nodemailer from 'nodemailer';

// wrong guesses allowed per code; after that only a new code works
export const MAX_ATTEMPTS = 5;

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
        const textBody = `<p>Hi ${escapeHtml(username)},</p>
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
                return { status: 'fail', data: error instanceof Error ? error.message : String(error) };
        }
};


export async function generateEmailVerificationCode(email: string): Promise<string> {
        const code = randomInt(100000, 1000000).toString(); // 6-digit code
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // existing verification should be updated
        const existingVerification = await EmailVerification.findOne({
                where: { email },
        });

        if (existingVerification) {
                existingVerification.setDataValue('code', code);
                existingVerification.setDataValue('expiresAt', expiresAt);
                existingVerification.setDataValue('used', false);
                existingVerification.setDataValue('attempts', 0);
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
                // a code works once, until it expires
                if (record.getDataValue('used')) return failedResponse;
                const codeExpired = record.getDataValue('expiresAt') < new Date();
                if (codeExpired) return failedResponse;

                // a 6-digit code can be guessed, so it only gets a few tries
                if (record.getDataValue('attempts') >= MAX_ATTEMPTS) {
                        return { success: false, message: 'Too many wrong codes. Request a new code.' };
                }

                // is code correct
                const code = record.getDataValue('code');
                if (code !== inputCode) {
                        record.setDataValue('attempts', record.getDataValue('attempts') + 1);
                        await record.save();
                        return failedResponse;
                }

                // verified
                record.setDataValue('used', true)
                await record.save();

                return { success: true, message: 'Verification successful.' };
        }

        // record not found
        return failedResponse;
}

function escapeHtml(text: string): string {
        return text
                .replaceAll('&', '&amp;')
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;')
                .replaceAll('"', '&quot;')
                .replaceAll("'", '&#39;');
}
