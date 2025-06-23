import type { Handle } from '@sveltejs/kit';
import { validateSessionToken } from 'utils/session';

export const handle: Handle = async ({ event, resolve }) => {
        const token = event.cookies.get('session');
        event.locals.user = await validateSessionToken(token);
        console.log('[handle]', await validateSessionToken(token), event.url.pathname, event.cookies.get('session'));
        return await resolve(event);
};

