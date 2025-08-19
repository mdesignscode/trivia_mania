import { processCategories, type TQuestionData } from 'utils/processCategories';

describe('processCategories', () => {
        it('aggregates difficulties and adds All Categories', () => {
                const input: TQuestionData[] = [
                        { category: 'Math', difficulty: 'easy', count: 2 },
                        { category: 'Math', difficulty: 'hard', count: 1 },
                        { category: 'Science', difficulty: 'medium', count: 3 }
                ];
                const { allCategories, allDifficulties } = processCategories(input, ['easy', 'medium', 'hard']);

                expect(allDifficulties).toContain('easy');
                expect(allCategories['Math']['all difficulties'].count).toBe(3);
                expect(allCategories['All Categories']['all difficulties'].count).toBe(6);
        });
});

