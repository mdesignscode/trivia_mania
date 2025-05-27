import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { Session, User } from 'models';

export function generateSessionToken(): string {
        const bytes = new Uint8Array(20);
        crypto.getRandomValues(bytes);
        return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(token: string, userId: string) {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

        await Session.create({ id: sessionId, UserId: userId, expiresAt: Math.floor(expiresAt.getTime() / 1000) });
}

export async function validateSessionToken(token: string) {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const row = await Session.findOne({
                where: {
                        id: sessionId,
                }
        });

        if (!row) {
                return { session: null, user: null };
        }
        const userId = row.getDataValue('UserId');

        const session = {
                id: sessionId,
                userId,
                expiresAt: new Date(row.getDataValue('expiresAt') * 1000),
        };
        const user = await User.findOne({ where: { id: userId } });

        if (Date.now() >= session.expiresAt.getTime()) {
                await Session.destroy({ where: { id: sessionId } });
                return { session: null, user: null };
        }

        return { session, user };
}

export async function invalidateSession(sessionId: string) {
        await Session.destroy({ where: { id: sessionId } });
}

