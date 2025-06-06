import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { User, Session } from 'models';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { randomUUID } from 'crypto';
import { unlink } from 'fs/promises';
import { getUserByName } from 'currentUser';

export const actions: Actions = {
        setDefaultAvatar: async ({ request }) => {
                const formData = await request.formData();
                const username = formData.get('username')?.toString();
                const defaultPath = '/images/icons8-user-64.png';

                if (!username) return fail(400, { error: 'Missing username' });

                const user = await getUserByName(username);

                if (user.getDataValue('avatar') === defaultPath) return user.dataValues;

                // remove prev avatar
                try {
                        await unlink('static' + user.getDataValue('avatar'));
                } catch { ; }

                user.setDataValue('avatar', defaultPath);
                await user.save()

                return { message: "Avatar updated", user: user.dataValues };
        },
        changeAvatar: async ({ request }) => {
                const formData = await request.formData();
                const avatar = formData.get('avatar')
                const username = formData.get('username')?.toString();
                const defaultPath = '/images/icons8-user-64.png';

                if (!username) return fail(400, { error: 'Missing username' });

                if (!avatar) return fail(400, { error: 'Missing avatar' });

                // generate image buffer
                const arrayBuffer = await (avatar as any).arrayBuffer() as ArrayBuffer;
                const buffer = Buffer.from(arrayBuffer);

                if (!isImageBuffer(buffer)) return fail(400, { error: 'Upload images only' });

                // check for valid user
                const user = await getUserByName(username);

                // generate file name
                const basePath = '/images/uploads/';
                const extension = avatar.name.split('.').at(-1);
                const filename = `${user.dataValues.username}_${randomUUID()}.${extension}`;

                // remove prev avatar
                if (user.getDataValue('avatar') !== defaultPath)
                        await unlink('static' + user.getDataValue('avatar'));

                // save image to disc
                const filePath = path.resolve('static' + basePath, filename)
                await fs.writeFile(filePath, buffer);

                // update user data
                user.setDataValue('avatar', basePath + filename);
                await user.save();

                return { message: "Avatar updated", user: user.dataValues };
        },
        changeUsername: async ({ request }) => {
                const formData = await request.formData();
                const newUsername = formData.get('newUsername')?.toString();
                const username = formData.get('username')?.toString();

                if (!username) return fail(400, { error: 'Missing username' });

                if (!newUsername) return fail(400, { error: 'Missing new display name' });

                const user = await getUserByName(username);

                user.setDataValue('username', newUsername);
                await user.save();
                return {
                        message: "Display name changed",
                        user: user.dataValues,
                };
        },
        changePassword: async ({ request }) => {
                const formData = await request.formData();
                const newPassword = formData.get('newPassword')?.toString();
                const currentPassword = formData.get('currentPassword')?.toString();
                const username = formData.get('username')?.toString();

                if (!username) return fail(400, { error: 'Missing username' });

                if (!newPassword || !currentPassword) return fail(400, { error: 'Missing password' });

                const user = await getUserByName(username, true);

                const validPassword = await bcrypt.compare(currentPassword, user.getDataValue('password'));
                if (!validPassword) {
                        return fail(400, { error: 'Invalid password.' });
                }

                const hashedPassword = await bcrypt.hash(newPassword, 10);

                user.setDataValue('password', hashedPassword);
                await user.save();
                const userData = user.dataValues;
                delete userData.password;

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
        deleteAccount: async ({ request }) => {
                const formData = await request.formData();
                const username = formData.get('username')?.toString();

                if (!username) return fail(400, { error: 'Missing username' });

                await User.destroy({
                        where: { username },
                });
                return { user: null, redirectTo: '/signup', message: 'Account deleted' };
        },
};

function isImageBuffer(buffer: Buffer): boolean {
        const magicNumbers = [
                { type: 'image/png', magic: [0x89, 0x50, 0x4E, 0x47] }, // PNG
                { type: 'image/jpeg', magic: [0xFF, 0xD8, 0xFF, 0xE0] }, // JPEG (JFIF)
                { type: 'image/gif', magic: [0x47, 0x49, 0x46, 0x38] }, // GIF
                { type: 'image/webp', magic: [0x52, 0x49, 0x46, 0x46] }, // WebP
                { type: 'image/bmp', magic: [0x42, 0x4D] } // BMP (BM)
        ];

        // Check the first few bytes of the buffer
        for (let img of magicNumbers) {
                if (buffer.slice(0, img.magic.length).every((byte, index) => byte === img.magic[index])) {
                        return true;
                }
        }

        return false;
}

