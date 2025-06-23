import { CategoryStat, Question, UserStats } from 'models';
import { fn, Op } from 'sequelize';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

const filterQuestions = async (url, userAnswered) => {
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

export const load: PageServerLoad = async ({ url, locals }) => {
        const user = locals.user;
        if (!user) throw redirect(302, '/login');
        const userAnswered = user?.get('answeredQuestions');
        return filterQuestions(url, userAnswered);
}

export const actions = {
        paginate: async ({ request, locals }) => {
                const user = locals.user;
                if (!user) throw redirect(302, '/login');

                const form = await request.formData();

                const difficulty = form.get('difficulty')?.toString();
                const categories = form.get('categories')?.toString();
                const _totalCorrect = form.get('totalCorrect')?.toString() || '0';
                const _stats = form.get('stats')?.toString();
                const _answeredQuestions = form.get('answeredQuestions')?.toString();

                if (!_stats) return fail(400, { error: 'User stats missing' });
                if (!_answeredQuestions) return fail(400, { error: 'Answered questions id list missing' });

                const stats = JSON.parse(_stats);
                const answeredQuestions = JSON.parse(_answeredQuestions);
                const totalCorrect = parseInt(_totalCorrect);

                // 🧠 Update user's answered questions (merge and dedupe)
                const existingAnswered = user.get('answeredQuestions') || [];
                const mergedAnswers = Array.from(new Set([...existingAnswered, ...answeredQuestions]));
                await user.update({ answeredQuestions: mergedAnswers });

                // 🦆 Mock URL-like object
                const url = {
                        searchParams: {
                                difficulty,
                                categories,
                                get(key) {
                                        return this[key];
                                }
                        }
                };

                // 📊 Get or create UserStats
                let userStats = await UserStats.findOne({
                        where: { UserId: user.get('id') },
                });

                if (!userStats) {
                        userStats = await UserStats.create({
                                UserId: user.get('id'),
                                total: answeredQuestions.length,
                                totalCorrect,
                        });
                } else {
                        userStats.update({
                                total: userStats.get('total') + answeredQuestions.length,
                                totalCorrect: userStats.get('totalCorrect') + totalCorrect,
                        });
                }

                // 🔁 Merge or create CategoryStat records
                await Promise.all(
                        Object.values(stats).map(stat => upsertCategoryStat(stat, userStats.id))
                );

                // 🎯 Return next batch of questions
                return filterQuestions(url, answeredQuestions);
        }
} satisfies Actions;

function mergeObjects(existing, incoming) {
        const allowedKeys = [
                'total',
                'totalCorrect',
                'totalEasy',
                'totalEasyCorrect',
                'totalMedium',
                'totalMediumCorrect',
                'totalHard',
                'totalHardCorrect',
        ];

        const merged = { ...existing };

        for (const key of allowedKeys) {
                const a = existing[key] || 0;
                const b = incoming[key] || 0;
                merged[key] = a + b;
        }

        return merged;
}


async function upsertCategoryStat(stat, userStatId) {
        const existing = await CategoryStat.findOne({
                where: {
                        category: stat.category,
                        UserStatId: userStatId,
                }
        });

        if (existing) {
                const merged = mergeObjects(existing.get(), stat);
                await CategoryStat.update(merged, { where: { id: existing.id } });
        } else {
                await CategoryStat.create({ ...stat, UserStatId: userStatId });
        }
}

