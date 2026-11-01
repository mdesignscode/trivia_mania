import { beforeEach, describe, expect, test, vi } from 'vitest';

const findOne = vi.fn();
vi.mock('models', () => ({ User: { findOne } }));

const sendEmail = vi.fn();
vi.mock('utils/emailVerification', () => ({
	sendEmail,
	validateEmailVerificationCode: vi.fn()
}));

const { load, actions } = await import('../../../../src/routes/signup/validate-email/+page.server');

function sessionUser(fields: Record<string, unknown>) {
	const data = { ...fields };
	return {
		get: (key?: string) => (key ? data[key] : { ...data }),
		setDataValue: (key: string, value: unknown) => (data[key] = value),
		save: vi.fn()
	};
}

const url = (email: string) => new URL(`http://localhost/signup/validate-email?email=${email}`);

describe('/signup/validate-email', () => {
	let user: ReturnType<typeof sessionUser>;

	beforeEach(() => {
		vi.clearAllMocks();
		user = sessionUser({ id: 'u1', username: 'Ada', email: 'ada@example.com', isVerified: false });
		sendEmail.mockResolvedValue({ status: 'success', data: '123456' });
	});

	test("shows the logged-in user's email, whatever the URL says", async () => {
		const data = await load({ url: url('someone@else.com'), locals: { user } } as any);

		expect(data).toEqual({ email: 'ada@example.com' });
		expect(findOne).not.toHaveBeenCalled();
	});

	test('sends a code to the new address when the email changes', async () => {
		findOne.mockResolvedValue(null);
		const body = new FormData();
		body.set('newEmail', 'New@Example.com');
		const request = new Request('http://localhost', { method: 'POST', body });

		const result = await actions.changeEmail({ request, locals: { user } } as any);

		expect(result).toMatchObject({ newEmail: 'new@example.com' });
		expect(sendEmail).toHaveBeenCalledWith({ email: 'new@example.com', username: 'Ada' });
	});

	test('refuses an email that another account uses', async () => {
		findOne.mockResolvedValue(sessionUser({ id: 'u2' }));
		const body = new FormData();
		body.set('newEmail', 'taken@example.com');
		const request = new Request('http://localhost', { method: 'POST', body });

		const result = await actions.changeEmail({ request, locals: { user } } as any);

		expect(result).toMatchObject({ status: 400 });
		expect(user.save).not.toHaveBeenCalled();
	});
});
