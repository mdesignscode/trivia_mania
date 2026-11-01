import { mockCategoriesQuery } from 'mockData';
import { mockUrl } from 'mockFunctions';
import { processCategories, filterQuestions } from 'utils/processFilters';
import { describe, expect, test } from 'vitest';

describe('processCategories', () => {
        test('aggregates difficulties and adds All Categories', () => {
                const { allCategories, allDifficulties } = processCategories(mockCategoriesQuery, ['easy', 'medium', 'hard']);

                expect(allDifficulties).toContain('easy');
                expect(allCategories['Science']['all difficulties'].count).toBe(3);
                expect(allCategories['All Categories']['all difficulties'].count).toBe(5);
        });
});

describe('filterQuestions', () => {
        test('returns a list of questions based on categories and difficulty', async () => {
                const filteredQuestions = await filterQuestions(mockUrl({}), []);
        });
});

