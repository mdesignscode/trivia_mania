import { expect, test } from 'vitest';

type TSearchParams = { difficulty?: string, categories?: string };
export const mockUrl = ({ categories = 'Science', difficulty = 'easy' }: TSearchParams) => ({
        searchParams: {
                difficulty,
                categories,
                get(key: 'difficulty' | 'categories'): TSearchParams[typeof key] | undefined {
                        return this[key];
                }
        }
} as any as URL);

export const testProtectedRoute = (action: Function) => {
        test('protected route', async () => {
                try {
                        await action({ locals: {} });
                } catch (e: any) {
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

