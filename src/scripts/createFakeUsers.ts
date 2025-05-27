import bcrypt from "bcryptjs";
import { CategoryStat, EasyStat, HardStat, MediumStat, Question, User } from "models";

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
        const correctAnswered = getRandomNumber(40, 100);

        // Create stat rows
        const easyStats = await EasyStat.create();
        const mediumStats = await MediumStat.create();
        const hardStats = await HardStat.create();

        // generate password
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(username, salt);

        const user = await User.create({
                password: hash,
                avatar,
                username,
                email: username,
                isVerfied: true,
                correctAnswered,
                easyStatId: easyStats.getDataValue('id'),
                mediumStatId: mediumStats.getDataValue('id'),
                hardStatId: hardStats.getDataValue('id'),
        });

        const categories = await Question.findAll({
                attributes: ['category'],
                group: ['category'],
                raw: true,
        });

        // Shuffle categories
        for (let i = categories.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [categories[i], categories[j]] = [categories[j], categories[i]];
        }

        const [easyCorrect, mediumCorrect, hardCorrect] = splitNumber(correctAnswered);

        for (const { category } of categories) {
                await CategoryStat.create({
                        category,
                        userId: user.getDataValue('id'),
                        easyAnswered: 0,
                        easyCorrect,
                        easyId: easyStats.getDataValue('id'),
                        mediumAnswered: 0,
                        mediumCorrect,
                        mediumId: mediumStats.getDataValue('id'),
                        hardAnswered: 0,
                        hardCorrect,
                        hardId: hardStats.getDataValue('id'),
                });
                console.log(`🟢 Created stat for ${category}`);
        }

        return user;
};

export async function createFakeUsers() {
        const fakeUsers = [
                'Lida Cross', 'Randall Park', 'Bill Buchanan', 'Douglas Russell',
                'Annie Baldwin', 'Don Willis', 'Catherine Pope',
                'Georgia Richards', 'Evelyn Gomez', 'Clifford Guerrero',
        ];

        for (const username of fakeUsers) {
                await createFakeUser(username);
                console.log(`✅ User created: ${username}`);
        }

        console.log('🌱 Seeding complete.');
}

