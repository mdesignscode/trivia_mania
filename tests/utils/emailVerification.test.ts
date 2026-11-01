import { beforeEach, describe, expect, test, vi } from 'vitest';

const findOne = vi.fn();
const create = vi.fn();
vi.mock('../../src/models', () => ({ EmailVerification: { findOne, create } }));

const sendMail = vi.fn();
vi.mock('nodemailer', () => ({ default: { createTransport: () => ({ sendMail }) } }));

const { MAX_ATTEMPTS, generateEmailVerificationCode, sendEmail, validateEmailVerificationCode } =
	await import('../../src/utils/emailVerification');

function verification(fields: Record<string, unknown>) {
	const data = { used: false, attempts: 0, ...fields };
	return {
		data,
		getDataValue: (key: string) => data[key as keyof typeof data],
		setDataValue: (key: string, value: unknown) => ((data as any)[key] = value),
		save: vi.fn()
	};
}

const inTenMinutes = () => new Date(Date.now() + 10 * 60 * 1000);

describe('validateEmailVerificationCode', () => {
	beforeEach(() => vi.clearAllMocks());

	test('accepts the right code once', async () => {
		const record = verification({ code: '123456', expiresAt: inTenMinutes() });
		findOne.mockResolvedValue(record);

		expect((await validateEmailVerificationCode('a@b.c', '123456')).success).toBe(true);
		expect((await validateEmailVerificationCode('a@b.c', '123456')).success).toBe(false);
	});

	test(`stops accepting any code after ${MAX_ATTEMPTS} wrong guesses`, async () => {
		const record = verification({ code: '123456', expiresAt: inTenMinutes() });
		findOne.mockResolvedValue(record);

		for (let i = 0; i < MAX_ATTEMPTS; i++) {
			await validateEmailVerificationCode('a@b.c', '000000');
		}
		const result = await validateEmailVerificationCode('a@b.c', '123456');

		expect(result.success).toBe(false);
		expect(result.message).toMatch(/new code/i);
	});

	test('refuses an expired code', async () => {
		const expired = new Date(Date.now() - 1000);
		findOne.mockResolvedValue(verification({ code: '123456', expiresAt: expired }));

		expect((await validateEmailVerificationCode('a@b.c', '123456')).success).toBe(false);
	});
});

describe('generateEmailVerificationCode', () => {
	beforeEach(() => vi.clearAllMocks());

	test('a new code resets the used flag and the guess count', async () => {
		const record = verification({ code: '123456', used: true, attempts: MAX_ATTEMPTS });
		findOne.mockResolvedValue(record);

		const code = await generateEmailVerificationCode('a@b.c');

		expect(code).toMatch(/^\d{6}$/);
		expect(record.data).toMatchObject({ code, used: false, attempts: 0 });
	});
});

describe('sendEmail', () => {
	test('escapes the username in the email body', async () => {
		findOne.mockResolvedValue(null);

		await sendEmail({ email: 'a@b.c', username: '<img src=x onerror=alert(1)>' });

		const { html } = sendMail.mock.calls[0][0];
		expect(html).not.toContain('<img');
		expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
	});
});
