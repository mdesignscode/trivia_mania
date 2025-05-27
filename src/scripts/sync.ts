import { sequelize } from "../models";
import { fillQuestions } from "./fillQuestions";
import { createFakeUsers } from "./createFakeUsers";

async function initDB() {
        try {
                console.log('Initializing Database sync');
                await sequelize.sync({ force: true }); // or alter: true
                console.log('✅ Database synced!');

                console.log('Filling Database with questions...');
                await fillQuestions();
                console.log('Filled Database with questions...');

                console.log('Creating fake users...');
                await createFakeUsers();
                console.log('Created fake users...');
        } catch (err) {
                console.error('❌ Failed to sync database:', err);
        }
}

initDB();

