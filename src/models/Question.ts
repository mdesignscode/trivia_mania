import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const Question = sequelize.define(
        'Question',
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
                answers: {
                        type: DataTypes.JSON,
                        allowNull: false,
                },
                correctAnswer: {
                        type: DataTypes.STRING,
                        allowNull: false,
                },
                question: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        unique: true,
                },
                difficulty: {
                        type: DataTypes.STRING,
                        allowNull: false,
                },
        },
);

export default Question;

