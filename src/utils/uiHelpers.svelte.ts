import { globalStore } from 'store';
import type { TAllCategories } from './processCategories';

export function updateLocalPreferences(allCategories: TAllCategories, localStorage: Storage) {
        const localDifficulty = localStorage.getItem('difficulty') || '';
        const localSelectedCategories = localStorage.getItem('selectedCategories') || '';
        const selectedCategories = localSelectedCategories ? localSelectedCategories.split(',') : [];
        const availableCategories: string[] = [];
        let filteredCategories;

        // check availability of category
        selectedCategories.forEach((c) => {
                if (allCategories[c] && allCategories[c][localDifficulty]) {
                        availableCategories.push(c);
                }
        });

        // update local storage with available categories
        if (selectedCategories.some((c) => !availableCategories.includes(c)))
                localStorage.setItem('selectedCategories', availableCategories.join(','));

        // sync filters
        globalStore.difficulty = localDifficulty;
        globalStore.categories = availableCategories;

        if (localDifficulty) {
                filteredCategories = Object.values(allCategories)
                        .map((value) => value[localDifficulty])
                        .filter(Boolean);
        }
        return filteredCategories;
}

export function handleSelectCategory(category: string) {
        let selectedCategories = globalStore.categories.includes(category)
                ? globalStore.categories.filter((cat) => cat !== category)
                : [...globalStore.categories, category];
        if (category === 'All Categories') {
                if (!globalStore.categories.includes(category)) selectedCategories = [category];
        } else {
                if (globalStore.categories.includes('All Categories'))
                        selectedCategories = selectedCategories.filter((cat) => cat !== 'All Categories');
        }
        globalStore.categories = selectedCategories;
};

export function handleSetDifficulty(localStorage: Storage, allCategories: TAllCategories, difficulty?: string) {
        if (difficulty && typeof difficulty === 'string') {
                globalStore.difficulty = difficulty;
                localStorage.setItem('difficulty', difficulty);
        }
        const filteredCategories = Object.values(allCategories)
                .map((value) => value[globalStore.difficulty])
                .filter(Boolean);
        return filteredCategories;
};

export const handlePlay = (localStorage: Storage, goto: (path: string) => {}) => {
        const playUri = encodeURI(
                `/play?difficulty=${globalStore.difficulty}&categories=${globalStore.categories.join(',')}`
        );
        localStorage.setItem('difficulty', globalStore.difficulty);
        localStorage.setItem('selectedCategories', globalStore.categories.join(','));
        goto(playUri);
};

