import { mockCategoriesQuery } from 'mockData';
import { processCategories } from 'utils/processCategories';
import { describe, expect, test } from 'vitest';

describe('processCategories', () => {
        test('aggregates difficulties and adds All Categories', () => {
                const { allCategories, allDifficulties } = processCategories(mockCategoriesQuery, ['easy', 'medium', 'hard']);

                expect(allDifficulties).toContain('easy');
                expect(allCategories['Science']['all difficulties'].count).toBe(3);
                expect(allCategories['All Categories']['all difficulties'].count).toBe(5);
        });
});

