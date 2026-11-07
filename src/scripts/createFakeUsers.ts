import bcrypt from "bcryptjs";
import { CategoryStat, Question, User, UserStats } from "models";

const avatar = '/images/icons8-user-64.png';

const getRandomNumber = (start: number, end: number): number =>
        Math.floor(Math.random() * (end - start + 1)) + start;

// answered and correct counts for one difficulty; correct never exceeds answered
const playDifficulty = () => {
        const answered = getRandomNumber(0, 30);
        const correct = getRandomNumber(Math.floor(answered * 0.3), answered);
        return { answered, correct };
};

const createFakeUser = async (username: string) => {
        // generate password
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(username, salt);
        const joinedUsername = username.split(' ').join('')
        const email = `${joinedUsername}@seed.email`;

        const user = await User.create({
                password: hash,
                avatar,
                username,
                email,
                isVerified: true,
        });

        const categories = await Question.findAll({
                attributes: ['category'],
                group: ['category'],
        });

        // build every category stat first, so the user totals are their sums
        const categoryStats = categories.map(({ category }) => {
                const easy = playDifficulty();
                const medium = playDifficulty();
                const hard = playDifficulty();
                return {
                        category,
                        total: easy.answered + medium.answered + hard.answered,
                        totalCorrect: easy.correct + medium.correct + hard.correct,
                        totalEasy: easy.answered,
                        totalEasyCorrect: easy.correct,
                        totalMedium: medium.answered,
                        totalMediumCorrect: medium.correct,
                        totalHard: hard.answered,
                        totalHardCorrect: hard.correct,
                };
        }).filter((stat) => stat.total > 0);

        const userStats = await UserStats.create({
                UserId: user.get('id'),
                total: categoryStats.reduce((sum, stat) => sum + stat.total, 0),
                totalCorrect: categoryStats.reduce((sum, stat) => sum + stat.totalCorrect, 0),
        });

        for (const stat of categoryStats) {
                await CategoryStat.create({ ...stat, UserStatId: userStats.get('id') });
                console.log(`🟢 Created stat for ${stat.category}`);
        }

        return user;
};

export async function createFakeUsers() {
        const fakeUsers = [
                'Lida Cross', 'Randall Park', 'Bill Buchanan', 'Douglas Russell',
                'Annie Baldwin', 'Don Willis', 'Catherine Pope',
                'Georgia Richards', 'Evelyn Gomez', 'Clifford Guerrero'
        ];

        for (const username of fakeUsers) {
                try {
                        await createFakeUser(username);
                        console.log(`✅ User created: ${username}`);
                } catch (err) {
                        console.log('DB populated with fake users already')
                        return;
                }
        }

        console.log('🌱 Seeding complete.');
}

