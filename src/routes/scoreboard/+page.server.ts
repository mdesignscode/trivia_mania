import { CategoryStat, User, UserStats, type TUserAttributes, type TUserStatsAttributes } from 'models';

export const load = async () => {
        const topUsers = await UserStats.findAll({
                include: [
                        {
                                model: User,
                                attributes: ['username', 'avatar'],
                        },
                ],
                order: [['totalCorrect', 'DESC']],
                limit: 10,
        });

        const topTen = await Promise.all(topUsers.map(async s => {
                const userCategories = await CategoryStat.findAll({
                        where: {
                                UserStatId: s.get('id'),
                        },
                });
                const categoryStats = userCategories.map(c => c.get());
                const { User: user, ...userStats } = s.get({ plain: true }) as TUserStatsAttributes & {
                        User: Pick<TUserAttributes, 'username' | 'avatar'>;
                };
                return { userStats, user, categoryStats };
        }));
        return { topTen };
}

