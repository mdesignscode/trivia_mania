import { sequelize } from "../models";
import { fillQuestions } from "./fillQuestions";
import { createFakeUsers } from "./createFakeUsers";
import { DataTypes } from "sequelize";

// sync() creates missing tables but never changes existing ones,
// so columns added to a model later are added here
async function addMissingColumns() {
        const queryInterface = sequelize.getQueryInterface();
        const verifications = await queryInterface.describeTable('EmailVerifications');
        if (!('attempts' in verifications)) {
                await queryInterface.addColumn('EmailVerifications', 'attempts', {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                        defaultValue: 0,
                });
                console.log('Added EmailVerifications.attempts');
        }

        // CategoryStat dropped its timestamps, but tables created before that
        // still require them, so every new category stat failed to insert
        const categoryStats = await queryInterface.describeTable('CategoryStats');
        for (const column of ['createdAt', 'updatedAt']) {
                if (column in categoryStats) {
                        await sequelize.query(`ALTER TABLE \`CategoryStats\` DROP COLUMN \`${column}\``);
                        console.log(`Removed CategoryStats.${column}`);
                }
        }
}

async function initDB() {
        try {
                console.log('Initializing Database sync');
                await sequelize.sync(); // or alter: true
                await addMissingColumns();
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

