import bcrypt from "bcryptjs";
import { CategoryStat, Question, User, UserStats } from "../models";
import { fn } from "sequelize";

const avatar = '/images/icons8-user-64.png';

const getRandomNumber = (start: number, end: number): number =>
        Math.floor(Math.random() * (end - start + 1)) + start;

const splitNumber = (number: number): number[] => {
        const randomNum1 = Math.floor(Math.random() * number);
        const randomNum2 = Math.floor(Math.random() * (number - randomNum1));
        const randomNum3 = number - randomNum1 - randomNum2;
        return [randomNum1, randomNum2, randomNum3].sort(() => Math.random() - 0.5);
};

const createFakeUser = async (username: string) => {
        const totalCorrect = getRandomNumber(40, 100);

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

        // create user stats
        const userStats = await UserStats.create({
                UserId: user.get('id'),
                totalCorrect,
        });

        const categories = await Question.findAll({
                attributes: ['category', 'difficulty'],
                group: ['category'],
                order: [fn('RANDOM')]
        });

        for (const { category, difficulty } of categories) {
                const categoryTotal = getRandomNumber(40, 100);
                const [easyCorrect, mediumCorrect, hardCorrect] = splitNumber(categoryTotal);

                await CategoryStat.create({
                        category,
                        totalCorrect: categoryTotal,
                        totalEasyCorrect: easyCorrect,
                        totalMediumCorrect: mediumCorrect,
                        totalHardCorrect: hardCorrect,
                        UserStatId: userStats.get('id'),
                });
                console.log(`🟢 Created stat for ${category}`);
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
                await createFakeUser(username);
                console.log(`✅ User created: ${username}`);
        }

        console.log('🌱 Seeding complete.');
}

