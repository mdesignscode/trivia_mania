import {
        CategoryStat,
        Question,
        UserStats,
        NewStatsSchema,
        type TCategoryStatAttributes,
        type TUserAttributes,
        type TUserStatsAttributes,
        type TNewStatsInput,
} from 'models';
import { fn, Op } from 'sequelize';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import z from 'zod';
import type { URL } from 'url';

const filterQuestions = async (url: URL, userAnswered: TUserAttributes['answeredQuestions']) => {
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
        return await filterQuestions(url, userAnswered);
};

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

                // === Validate stats ===
                const statsParseResult = NewStatsSchema.safeParse(JSON.parse(_stats ?? 'null'));
                if (!statsParseResult.success) {
                        return fail(400, {
                                error: 'Invalid stats format',
                                issues: statsParseResult.error.issues
                        });
                }
                const stats = statsParseResult.data;

                // === Validate answeredQuestions ===
                const answeredQuestionsParseResult = z
                        .array(z.number())
                        .safeParse(JSON.parse(_answeredQuestions ?? 'null'));
                if (!answeredQuestionsParseResult.success) {
                        return fail(400, {
                                error: 'Invalid answeredQuestions',
                                issues: answeredQuestionsParseResult.error.issues
                        });
                }
                const answeredQuestions = answeredQuestionsParseResult.data;

                const totalCorrect: TUserStatsAttributes['totalCorrect'] = parseInt(_totalCorrect);

                // 🧠 Update user's answered questions (merge and dedupe)
                const existingAnswered = user.get('answeredQuestions') || [];
                const mergedAnswers = Array.from(new Set([...existingAnswered, ...answeredQuestions]));
                await user.update({ answeredQuestions: mergedAnswers });

                // 🦆 Mock URL-like object
                type TSearchParams = { difficulty: string, categories: string };
                const url = {
                        searchParams: {
                                difficulty,
                                categories,
                                get(key: 'difficulty' | 'categories'): TSearchParams[typeof key] | undefined {
                                        return this[key];
                                }
                        }
                } as any as URL;

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

export type TPaginateSuccess = Awaited<ReturnType<typeof filterQuestions>>;

function mergeObjects(existing: TCategoryStatAttributes, incoming: TNewStatsInput) {
        const allowedKeys = [
                'total',
                'totalCorrect',
                'totalEasy',
                'totalEasyCorrect',
                'totalMedium',
                'totalMediumCorrect',
                'totalHard',
                'totalHardCorrect',
        ] as const;

        const merged = { ...existing };

        for (const key of allowedKeys) {
                const a = existing[key] || 0;
                const b = incoming[key] || 0;
                merged[key] = a + b;
        }

        return merged;
}

async function upsertCategoryStat(stat: TNewStatsInput, userStatId: TUserStatsAttributes['id']) {
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

