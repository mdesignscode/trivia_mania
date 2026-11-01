import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { User, Session } from 'models';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { randomUUID } from 'crypto';
import { unlink } from 'fs/promises';

export const load: PageServerLoad = ({ locals }) => {
        const user = locals.user;
        if (!user) throw redirect(302, '/login');
}

export const actions: Actions = {
        setDefaultAvatar: async ({ locals }) => {
                const user = locals.user;
                if (!user) throw redirect(302, '/login')

                const defaultPath = '/images/icons8-user-64.png';

                if (user.get('avatar') === defaultPath)
                        return { message: "Avatar unchanged", user: user.get() };

                // remove prev avatar
                try {
                        await unlink('static' + user.get('avatar'));
                } catch { ; }

                user.setDataValue('avatar', defaultPath);
                await user.save()

                return { message: "Avatar updated", user: user.get() };
        },
        changeAvatar: async ({ request, locals }) => {
                const user = locals.user;
                if (!user) throw redirect(302, '/login');

                const formData = await request.formData();
                const avatar = formData.get('avatar')
                const defaultPath = '/images/icons8-user-64.png';

                if (!avatar) return fail(400, { error: 'Missing avatar' });

                // generate image buffer
                const arrayBuffer = await (avatar as any).arrayBuffer() as ArrayBuffer;
                const buffer = Buffer.from(arrayBuffer);

                // the extension comes from the bytes, never from the uploaded name,
                // so nothing but an image can be served from /images/uploads
                const extension = imageExtension(buffer);
                if (!extension) return fail(400, { error: 'Upload images only' });

                // generate file name
                const basePath = '/images/uploads/';
                const filename = `${user.get('username')}_${randomUUID()}.${extension}`;

                // remove prev avatar
                if (user.get('avatar') !== defaultPath)
                        await unlink('static' + user.get('avatar'));

                // save image to disc
                const filePath = path.resolve('static' + basePath, filename)
                await fs.writeFile(filePath, buffer);

                // update user data
                user.setDataValue('avatar', basePath + filename);
                await user.save();

                return { message: "Avatar updated", user: user.get() };
        },
        changeUsername: async ({ request, locals }) => {
                const user = locals.user;
                if (!user) throw redirect(302, '/login');

                const formData = await request.formData();
                const newUsername = formData.get('newUsername')?.toString();

                if (!newUsername) return fail(400, { error: 'Missing new display name' });

                user.setDataValue('username', newUsername);
                await user.save();
                return {
                        message: "Display name changed",
                        user: user.get(),
                };
        },
        changePassword: async ({ request, locals }) => {
                const user = locals.user;
                if (!user) throw redirect(302, '/login');

                const formData = await request.formData();
                const newPassword = formData.get('newPassword')?.toString();
                const currentPassword = formData.get('currentPassword')?.toString();

                if (!newPassword || !currentPassword) return fail(400, { error: 'Missing password' });

                // the session user is loaded without its password hash
                const account = await User.findByPk(user.get('id'), { attributes: ['password'] });
                if (!account) throw redirect(302, '/login');

                const validPassword = await bcrypt.compare(currentPassword, account.get('password'));
                if (!validPassword) {
                        return fail(400, { error: 'Invalid password.' });
                }

                const hashedPassword = await bcrypt.hash(newPassword, 10);

                user.setDataValue('password', hashedPassword);
                await user.save();
                const { password: _password, ...userData } = user.get();

                return { user: userData, message: 'Password updated' }
        },
        logout: async ({ cookies }) => {
                const token = cookies.get('session');
                if (!token) throw redirect(302, "/login");
                const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
                await Session.destroy({ where: { id: sessionId } })
                cookies.delete('session', { path: '/' });
                return { user: null, redirectTo: '/login', message: 'Logged out' };
        },
        deleteAccount: async ({ locals }) => {
                const user = locals.user;
                if (!user) throw redirect(302, '/login');

                await User.destroy({
                        where: { username: user.get('username') },
                });
                return { user: null, redirectTo: '/signup', message: 'Account deleted' };
        },
};

function imageExtension(buffer: Buffer): string | null {
        const magicNumbers = [
                { extension: 'png', magic: [0x89, 0x50, 0x4E, 0x47] }, // PNG
                { extension: 'jpg', magic: [0xFF, 0xD8, 0xFF, 0xE0] }, // JPEG (JFIF)
                { extension: 'gif', magic: [0x47, 0x49, 0x46, 0x38] }, // GIF
                { extension: 'webp', magic: [0x52, 0x49, 0x46, 0x46] }, // WebP
                { extension: 'bmp', magic: [0x42, 0x4D] } // BMP (BM)
        ];

        // Check the first few bytes of the buffer
        for (let img of magicNumbers) {
                if (buffer.subarray(0, img.magic.length).every((byte, index) => byte === img.magic[index])) {
                        return img.extension;
                }
        }

        return null;
}

