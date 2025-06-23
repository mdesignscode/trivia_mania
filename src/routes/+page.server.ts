import { redirect } from '@sveltejs/kit';
import { Question } from 'models';
import { Op } from 'sequelize';

export const load = async ({ locals }) => {
        const user = locals.user;
        if (!user) throw redirect(302, '/login');

        // get all difficulties
        const difficulties = await Question.findAll({
                group: 'difficulty',
                attributes: ['difficulty'],
                where: {
                        id: {
                                [Op.notIn]: user?.get('answeredQuestions'),
                        }
                },
        })

        // count all questions by category
        const categories = await Question.count({
                group: ['category', 'difficulty'],
                attributes: ['category', 'difficulty'],
                where: {
                        id: {
                                [Op.notIn]: user?.get('answeredQuestions'),
                        }
                },
        });

        // map difficulties to categories
        const allCategories = {};
        categories.forEach(({ difficulty, count, category }) => {
                if (!allCategories[category]) allCategories[category] = {};
                if (!allCategories[category][difficulty]) allCategories[category][difficulty] = {};

                allCategories[category][difficulty] = { difficulty, count, category };
        });

        // add total questions for each category
        Object.keys(allCategories).forEach(key => {
                const { easy, medium, hard } = allCategories[key];
                const allDifficultiesCount = (easy?.count || 0) + (medium?.count || 0) + (hard?.count || 0);
                allCategories[key]['all difficulties'] = {
                        difficulty: 'all difficulties',
                        count: allDifficultiesCount,
                        category: key
                };
        });

        // Add 'All Categories' aggregate
        const totalCategories = {
                easy: { difficulty: 'easy', count: 0, category: 'All Categories' },
                medium: { difficulty: 'medium', count: 0, category: 'All Categories' },
                hard: { difficulty: 'hard', count: 0, category: 'All Categories' },
                'all difficulties': { difficulty: 'all difficulties', count: 0, category: 'All Categories' }
        };

        // Aggregate the counts from all individual categories
        Object.values(allCategories).forEach(categoryGroup => {
                ['easy', 'medium', 'hard'].forEach(level => {
                        if (categoryGroup[level]) {
                                totalCategories[level].count += categoryGroup[level].count;
                                totalCategories['all difficulties'].count += categoryGroup[level].count;
                        }
                });
        });

        // Assign the computed aggregate to the top-level object
        allCategories['All Categories'] = totalCategories;

        // list of all difficulties
        const allDifficulties = difficulties.map(difficulty => difficulty.getDataValue('difficulty'));

        return { allDifficulties, allCategories };
}

