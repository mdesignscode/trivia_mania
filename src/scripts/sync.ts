import { sequelize } from "../models";

async function initDB() {
        try {
                await sequelize.sync({ force: true }); // or alter: true
                console.log('✅ Database synced!');
        } catch (err) {
                console.error('❌ Failed to sync database:', err);
        }

        // try {
        //         await sequelize.authenticate();
        //         console.log('Connection has been established successfully.');
        // } catch (error) {
        //         console.error('Unable to connect to the database:', error);
        // }
}

initDB();

