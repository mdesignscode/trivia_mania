import { CategoryStat, User, UserStats } from 'models';

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
                const stats = { userStats: s.get(), user: s.get('User').get(), categoryStats }
                delete stats.userStats.User;
                return stats;
        }));
        return { topTen };
}

