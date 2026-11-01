import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const findOne = vi.fn();
vi.mock('models', () => ({ User: { findOne } }));
vi.mock('utils/session', () => ({
	createSession: vi.fn(),
	generateSessionToken: () => 'token'
}));

const { actions } = await import('../../../src/routes/login/+page.server');

const login = (password: string, email = 'ada@example.com') => {
	const body = new FormData();
	body.set('email', email);
	body.set('password', password);
	const cookies = { set: vi.fn() };
	const request = new Request('http://localhost/login', { method: 'POST', body });
	return { cookies, result: actions.default({ request, cookies } as any) };
};

describe('/login action', () => {
	beforeEach(() => {
		const hash = bcrypt.hashSync('right password', 4);
		const fields = { id: 'u1', email: 'ada@example.com', password: hash };
		findOne.mockResolvedValue({
			get: (key?: keyof typeof fields) => (key ? fields[key] : { ...fields })
		});
	});

	test('rejects a wrong password', async () => {
		const { cookies, result } = login('wrong password');

		expect(await result).toMatchObject({ status: 400 });
		expect(cookies.set).not.toHaveBeenCalled();
	});

	test('logs in with the right password, without returning the hash', async () => {
		const { cookies, result } = login('right password');

		expect(await result).toEqual({ user: { id: 'u1', email: 'ada@example.com' } });
		expect(cookies.set).toHaveBeenCalledOnce();
	});

	test('finds the account whatever the email case', async () => {
		const { result } = login('right password', ' Ada@Example.com ');

		await result;
		expect(findOne).toHaveBeenLastCalledWith({ where: { email: 'ada@example.com' } });
	});
});
