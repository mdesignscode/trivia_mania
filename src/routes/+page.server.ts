import { redirect } from '@sveltejs/kit';
import { Question } from 'models';
import { Op } from 'sequelize';
import { processCategories } from 'utils/processCategories';

export const load = async ({ locals }) => {
        const user = locals.user;
        if (!user) throw redirect(302, '/login');

        const difficultiesQuery = await Question.findAll({
                group: 'difficulty',
                attributes: ['difficulty'],
                where: {
                        id: {
                                [Op.notIn]: user?.get('answeredQuestions')
                        }
                }
        });

        const categoriesQuery = await Question.count({
                group: ['category', 'difficulty'],
                attributes: ['category', 'difficulty'],
                where: {
                        id: {
                                [Op.notIn]: user?.get('answeredQuestions')
                        }
                }
        });

        const difficulties = difficultiesQuery.map((d) =>
                d.getDataValue('difficulty')
        );

        const categories = categoriesQuery.map((row: any) => ({
                category: row.category,
                difficulty: row.difficulty,
                count: row.count
        }));

        return processCategories(categories, difficulties);
};

