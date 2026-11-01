import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const findByPk = vi.fn();
vi.mock('models', () => ({ User: { findByPk }, Session: {} }));

const writeFile = vi.fn();
const unlink = vi.fn();
vi.mock('fs/promises', () => ({ default: { writeFile }, writeFile, unlink }));

const { actions } = await import('../../../src/routes/settings/+page.server');

const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// the session user, loaded without the password hash like hooks.server.ts does
function sessionUser(fields: Record<string, unknown>) {
	const data = { ...fields };
	return {
		get: (key?: string) => (key ? data[key] : { ...data }),
		setDataValue: (key: string, value: unknown) => (data[key] = value),
		save: vi.fn()
	};
}

const post = (fields: Record<string, string | Blob>, file?: { name: string }) => {
	const body = new FormData();
	for (const [key, value] of Object.entries(fields)) {
		if (value instanceof Blob) body.set(key, value, file?.name);
		else body.set(key, value);
	}
	return new Request('http://localhost/settings', { method: 'POST', body });
};

describe('/settings actions', () => {
	let user: ReturnType<typeof sessionUser>;

	beforeEach(() => {
		vi.clearAllMocks();
		user = sessionUser({ id: 'u1', username: 'Ada', avatar: '/images/icons8-user-64.png' });
		const hash = bcrypt.hashSync('old password', 4);
		findByPk.mockResolvedValue({ get: (key: string) => ({ password: hash })[key] });
	});

	test('changes the password when the current one is right', async () => {
		const request = post({ currentPassword: 'old password', newPassword: 'new password' });

		const result = await actions.changePassword({ request, locals: { user } } as any);

		expect(result).toMatchObject({ message: 'Password updated' });
		expect(bcrypt.compareSync('new password', user.get('password') as string)).toBe(true);
		expect((result as any).user.password).toBeUndefined();
	});

	test('refuses a wrong current password', async () => {
		const request = post({ currentPassword: 'guess', newPassword: 'new password' });

		const result = await actions.changePassword({ request, locals: { user } } as any);

		expect(result).toMatchObject({ status: 400 });
		expect(user.save).not.toHaveBeenCalled();
	});

	test('saves an avatar under its real image type, not the uploaded name', async () => {
		const request = post({ avatar: new Blob([PNG]) }, { name: 'page.html' });

		const result = (await actions.changeAvatar({ request, locals: { user } } as any)) as any;

		const avatar = user.get('avatar') as string;
		expect(avatar).toMatch(/^\/images\/uploads\/Ada_[0-9a-f-]{36}\.png$/);
		expect(writeFile).toHaveBeenCalledOnce();
		expect(result.user.avatar).toBe(avatar);
	});

	test('refuses a file that is not an image', async () => {
		const request = post({ avatar: new Blob(['<script>']) }, { name: 'cat.png' });

		const result = await actions.changeAvatar({ request, locals: { user } } as any);

		expect(result).toMatchObject({ status: 400 });
		expect(writeFile).not.toHaveBeenCalled();
	});
});
