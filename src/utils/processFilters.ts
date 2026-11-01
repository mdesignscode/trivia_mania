import { Question, type TUserAttributes } from "models";
import { fn, Op } from "sequelize";

export type TQuestionData = {
        category: string;
        difficulty: string;
        count: number;
};
export type TAllCategories = Record<string, Record<string, TQuestionData>>;

export type TProcessResult = {
        allCategories: TAllCategories;
        allDifficulties: string[];
};

export function processCategories(
        categories: TQuestionData[],
        difficulties: string[]
): TProcessResult {
        const allCategories: TAllCategories = {};

        // map difficulties to categories
        categories.forEach(({ difficulty, count, category }) => {
                if (!allCategories[category]) allCategories[category] = {};
                allCategories[category][difficulty] = { difficulty, count, category };
        });

        // add "all difficulties" count for each category
        Object.keys(allCategories).forEach((key) => {
                const easy = allCategories[key].easy?.count || 0;
                const medium = allCategories[key].medium?.count || 0;
                const hard = allCategories[key].hard?.count || 0;
                const allCount = easy + medium + hard;

                allCategories[key]['all difficulties'] = {
                        difficulty: 'all difficulties',
                        count: allCount,
                        category: key
                };
        });

        // total "All Categories" aggregate
        const totalCategories: Record<string, TQuestionData> = {
                easy: { difficulty: 'easy', count: 0, category: 'All Categories' },
                medium: { difficulty: 'medium', count: 0, category: 'All Categories' },
                hard: { difficulty: 'hard', count: 0, category: 'All Categories' },
                'all difficulties': {
                        difficulty: 'all difficulties',
                        count: 0,
                        category: 'All Categories'
                }
        };

        Object.values(allCategories).forEach((catGroup) => {
                ['easy', 'medium', 'hard'].forEach((level) => {
                        if (catGroup[level]) {
                                totalCategories[level].count += catGroup[level].count;
                                totalCategories['all difficulties'].count += catGroup[level].count;
                        }
                });
        });

        allCategories['All Categories'] = totalCategories;

        return {
                allCategories,
                allDifficulties: [...difficulties]
        };
}

export const filterQuestions = async (url: URL, userAnswered: TUserAttributes['answeredQuestions']) => {
        const categories = (url.searchParams.get('categories') || 'All Categories').split(',');
        const difficulty = url.searchParams.get('difficulty') || 'all difficulties';

        const difficultyFilter = difficulty === 'all difficulties' ? {} : { difficulty };
        const categoriesFilter = categories.includes('All Categories')
                ? {}
                : { category: { [Op.in]: categories } };

        const allQuestions = await Question.findAndCountAll({
                where: {
                        ...difficultyFilter,
                        ...categoriesFilter,
                        id: {
                                [Op.notIn]: userAnswered,
                        }
                },
                limit: 5,
                order: [fn('RANDOM')],
        });

        const questions = allQuestions.rows.map(q => q.get());
        return { questions, total: allQuestions.count };
};

