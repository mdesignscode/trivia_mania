import { db } from '$lib/db';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';

export function generateSessionToken(): string {
        const bytes = new Uint8Array(20);
        crypto.getRandomValues(bytes);
        return encodeBase32LowerCaseNoPadding(bytes);
}

export function createSession(token: string, userId: number) {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

        db.prepare(
                'INSERT INTO session (id, user_id, expires_at) VALUES (?, ?, ?)'
        ).run(sessionId, userId, Math.floor(expiresAt.getTime() / 1000));
}

export function validateSessionToken(token: string) {
        const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

        const row = db.prepare(`
    SELECT session.id, session.user_id, session.expires_at, user.username
    FROM session
    INNER JOIN user ON user.id = session.user_id
    WHERE session.id = ?
  `).get(sessionId);

        if (!row) {
                return { session: null, user: null };
        }

        const session = {
                id: row.id as string,
                userId: row.user_id as number,
                expiresAt: new Date(row.expires_at * 1000)
        };
        const user = {
                username: row.username as string
        };

        if (Date.now() >= session.expiresAt.getTime()) {
                db.prepare('DELETE FROM session WHERE id = ?').run(session.id);
                return { session: null, user: null };
        }

        return { session, user };
}

export function invalidateSession(sessionId: string) {
        db.prepare('DELETE FROM session WHERE id = ?').run(sessionId);
}

