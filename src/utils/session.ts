import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { Session, User } from 'models';

export function generateSessionToken(): string {
        const bytes = new Uint8Array(20);
        crypto.getRandomValues(bytes);
        const token =  encodeBase32LowerCaseNoPadding(bytes);
        return token;
}

export async function createSession(token: string, userId: string) {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

        await Session.create({ id: sessionId, UserId: userId, expiresAt: Math.floor(expiresAt.getTime() / 1000) });
}

export async function validateSessionToken(token: string | undefined) {
        if (!token) return;
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const row = await Session.findOne({
                where: {
                        id: sessionId,
                }
        });

        if (!row) return;

        const userId = row.get('UserId');

        const session = {
                id: sessionId,
                userId,
                expiresAt: new Date(row.get('expiresAt') * 1000),
        };
        const user = await User.findOne({
                where: {
                        id: userId
                },
                attributes: {
                        exclude: ['password'],
                },
        });

        if (Date.now() >= session.expiresAt.getTime()) {
                await Session.destroy({ where: { id: sessionId } });
                return;
        }

        return user;
}

export async function invalidateSession(sessionId: string) {
        await Session.destroy({ where: { id: sessionId } });
}

