import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const UserStats = sequelize.define(
        'UserStats',
        {
                id: {
                        type: DataTypes.INTEGER,
                        autoIncrement: true,
                        primaryKey: true,
                },
                total: {
                        type: DataTypes.INTEGER,
                        defaultValue: 0,
                },
                totalCorrect: {
                        type: DataTypes.INTEGER,
                        defaultValue: 0,
                },
        },
);

export default UserStats;

