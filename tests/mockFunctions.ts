import { expect, test } from 'vitest';

export const testProtectedRoute = (action: Function) => {
        test('protected route', async () => {
                try {
                        await action({ locals: {} });
                } catch (e) {
                        expect(e.status).toBe(302);
                        expect(e.location).toBe('/login');
                }
        });
};

export const mockLocalStorage = {
        storage: {},
        setItem(key: string, value: string) {
                this.storage[key] = value;
        },
        getItem(value: string) {
                return this.storage[value];
        },
        removeItem(key: string) {
                delete this.storage[key];
        },
        clear() {
                this.storage = {};
        },
} as any as Storage;

