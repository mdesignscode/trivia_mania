import { updateLocalPreferences, handleSelectCategory, handleSetDifficulty, handlePlay } from "utils/uiHelpers.svelte";
import { mockAllCategories } from "../mockData";
import type { TQuestionData } from "utils/processCategories";
import { globalStore } from "utils/store";

const mockGoto = jest.fn()
const expectedFilteredCategories: TQuestionData[] = [
        { "category": "Society And Culture", "count": 1, "difficulty": "easy" },
        { "category": "Science", "count": 2, "difficulty": "easy" },
        { "category": "All Categories", "count": 3, "difficulty": "easy" }
];

describe('updateLocalPreferences', () => {
        it('sets selected filters in localStorage', () => {
                // store some filters in localStorage
                localStorage.setItem('difficulty', 'easy');
                localStorage.setItem('selectedCategories', 'Science,Math');

                const filteredCategories = updateLocalPreferences(mockAllCategories, localStorage);

                // unavailable categories should be removed
                const selectedCategories = localStorage.getItem('selectedCategories')?.split(',');
                expect(selectedCategories).toContain('Science');
                expect(selectedCategories).not.toContain('Math');

                // should return a list of available categories
                expect(filteredCategories).toEqual(expectedFilteredCategories);

                // should update store with filters
                expect(globalStore.difficulty).toBe('easy');
                expect(globalStore.categories).toEqual(['Science']);
        });
});

describe("handleSelectCategory", () => {
        it("updates the list of categories based on a given category", () => {
                handleSelectCategory('Science');
                handleSelectCategory('Math');
                expect(globalStore.categories).toEqual(['Science', 'Math']);

                // remove category if already in list
                handleSelectCategory('Math');
                expect(globalStore.categories).toEqual(['Science']);

                // `all categories` resets list to only `All Categories`
                handleSelectCategory('All Categories');
                expect(globalStore.categories).toEqual(['All Categories']);

                // `All Categories` will never be present with other categories
                handleSelectCategory('Math');
                expect(globalStore.categories).toEqual(['Math']);
        });
})

describe("handleSetDifficulty", () => {
        it("sets difficulty in local storage and store", () => {
                const filteredCategories = handleSetDifficulty(localStorage, mockAllCategories, 'easy')
                expect(globalStore.difficulty).toBe('easy');
                expect(localStorage.getItem('difficulty')).toBe('easy');
                expect(filteredCategories).toEqual(expectedFilteredCategories);
        })
})

describe("handlePlay", () => {
        it("stores filters in local storage, then navigates to play page, with filters as query params", () => {
                globalStore.difficulty = 'easy';
                globalStore.categories = ['Science'];
                handlePlay(localStorage, mockGoto);
                expect(localStorage.getItem('difficulty')).toBe('easy');
                expect(localStorage.getItem('selectedCategories')).toBe('Science');
                const expectedRoute = '/play?difficulty=easy&categories=Science';
                expect(mockGoto).toHaveBeenCalledWith(expectedRoute);
        })
})


