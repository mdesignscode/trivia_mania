import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const CategoryStat = sequelize.define(
        'CategoryStat',
        {
                id: {
                        type: DataTypes.INTEGER,
                        autoIncrement: true,
                        primaryKey: true,
                },
                category: {
                        type: DataTypes.STRING,
                        allowNull: false,
                },

                // total answered
                total: {
                        type: DataTypes.INTEGER,
                        defaultValue: 0,
                },
                totalCorrect: {
                        type: DataTypes.INTEGER,
                        defaultValue: 0,
                },

                // easy answered
                totalEasy: {
                        type: DataTypes.INTEGER,
                        defaultValue: 0,
                },
                totalEasyCorrect: {
                        type: DataTypes.INTEGER,
                        defaultValue: 0,
                },

                // medium answered
                totalMedium: {
                        type: DataTypes.INTEGER,
                        defaultValue: 0,
                },
                totalMediumCorrect: {
                        type: DataTypes.INTEGER,
                        defaultValue: 0,
                },

                // hard answered
                totalHard: {
                        type: DataTypes.INTEGER,
                        defaultValue: 0,
                },
                totalHardCorrect: {
                        type: DataTypes.INTEGER,
                        defaultValue: 0,
                },
        }, {
                indexes: [
                        {
                                unique: true,
                                fields: ['userStatId', 'category'], // <-- Composite unique constraint
                        },
                ],
        }
);

export default CategoryStat;

