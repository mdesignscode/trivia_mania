import { redirect } from '@sveltejs/kit';
import { CategoryStat, User, UserStats } from 'models';

export const load = async ({ locals }) => {
        const user = locals.user;
        if (!user) throw redirect(302, '/login');

        const userStats = await UserStats.findOne({
                where: {
                        UserId: user.get('id'),
                }
        });

        if (!userStats) {
                return { stats: null };
        }
        const allCategoryStats = await CategoryStat.findAll({
                where: {
                        UserStatId: userStats.get('id'),
                }
        })
        const userCategoryStats = allCategoryStats.map(s => s.get());

        const topUsers = await UserStats.findAll({
                include: [
                        {
                                model: User,
                                attributes: ['username'],
                        },
                ],
                order: [['totalCorrect', 'DESC']],
                limit: 10,
        });

        let topTenPosition = 0;
        topUsers.forEach((u, i) => {
                if (u.get('UserId') === user?.get('id'))
                        topTenPosition = i + 1;
        });
        return { stats: userCategoryStats, user: user?.get(), topTenPosition, userStats: userStats.get(), };
}

