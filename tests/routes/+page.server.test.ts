import { redirect } from '@sveltejs/kit';
import { mockAllQuestions, mockCategoriesQuery, mockUser } from 'mockData';
import { testProtectedRoute } from 'mockFunctions';
import { load } from 'routes/+page.server'
import { processCategories } from 'utils/processCategories';
import { vi, describe, expect, test } from 'vitest'

vi.mock('models', () => ({
        Question: {
                findAll() {
                        return mockAllQuestions;
                },
                count() {
                        return mockCategoriesQuery;
                },
        }
}));

vi.mock('@sveltejs/kit', { spy: true });

vi.mock('utils/processCategories', { spy: true });

describe("/ server", () => {
        test('returns processed queries', async () => {
                await load({ locals: { user: mockUser } });
                expect(processCategories).toHaveBeenCalledWith(mockCategoriesQuery, ['easy', 'hard']);
        });

        testProtectedRoute(load);
});

