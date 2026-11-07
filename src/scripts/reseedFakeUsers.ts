import { Op } from "sequelize";
import { CategoryStat, Session, User, UserStats } from "models";
import { createFakeUsers } from "./createFakeUsers";

// removes the sample players (and only them) and creates them again
async function reseed() {
        const seedUsers = await User.findAll({ where: { email: { [Op.like]: '%@seed.email' } } });
        const userIds = seedUsers.map((u) => u.get('id'));
        const stats = await UserStats.findAll({ where: { UserId: userIds } });
        const statIds = stats.map((s) => s.get('id'));

        await CategoryStat.destroy({ where: { UserStatId: statIds } });
        await UserStats.destroy({ where: { id: statIds } });
        await Session.destroy({ where: { UserId: userIds } });
        await User.destroy({ where: { id: userIds } });
        console.log(`Removed ${userIds.length} sample players`);

        await createFakeUsers();
}

reseed();
