import { PrismaClient } from "./prisma/generated/client";

const prisma = new PrismaClient();

const avatar = 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yY3NGa3JNS3VXSXZDaUI4VFp2U3RSZW9RV3kifQ'

const getRandomNumber = (start: number, end: number) =>
  Math.floor(Math.random() * (end - start + 1)) + start;

const splitNumber = (number: number): number[] => {
  const randomNum1: number = Math.floor(Math.random() * number);
  const randomNum2: number = Math.floor(Math.random() * (number - randomNum1));
  const randomNum3: number = number - randomNum1 - randomNum2;

  const randomizedList: number[] = [randomNum1, randomNum2, randomNum3].sort(
    () => Math.random() - 0.5
  );

  return randomizedList;
};

const createFakeUser = async (username: string) => {
  const correctAnswered = getRandomNumber(40, 100),
    triviaUser = await prisma.user.create({
      data: {
        id: username,
        avatar,
        username,
        correctAnswered,
        easyStats: {
          create: {},
        },
        mediumStats: {
          create: {},
        },
        hardStats: {
          create: {},
        },
      },
    }),
    // create random category stats
    categories = await prisma.question.groupBy({
      by: ["category"],
    });

  console.log({ triviaUser });

  // Fisher-Yates shuffle algorithm
  for (let i = categories.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [categories[i], categories[j]] = [categories[j], categories[i]];
  }

  const [easyCorrect, mediumCorrect, hardCorrect] =
    splitNumber(correctAnswered);

  categories.forEach(async ({ category }) => {
    const categoryStat = await prisma.categoryStat.create({
      data: {
        category,
        userId: username,
        easyAnswered: 0,
        easyCorrect,
        easyId: triviaUser.easyStatId,
        hardAnswered: 0,
        hardCorrect,
        hardId: triviaUser.hardStatId,
        mediumId: triviaUser.mediumStatId,
        mediumAnswered: 0,
        mediumCorrect,
      },
    });

    console.log({ categoryStat });
  });

  return triviaUser;
};

async function main() {
  const fakeUsers = ["Lida Cross", "Randall Park", "Bill Buchanan", "Douglas Russell", "Annie Baldwin", "Don Willis", "Catherine Pope", "Georgia Richards", "Evelyn Gomez", "Clifford Guerrero"]

  for (const username of fakeUsers) {
    await createFakeUser(username)
  }
}

main()
