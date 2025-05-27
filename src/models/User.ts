import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const User = sequelize.define(
        'User',
        {
                id: {
                        type: DataTypes.UUID,
                        defaultValue: DataTypes.UUIDV4,
                        primaryKey: true,
                },
                isVerified: {
                        type: DataTypes.BOOLEAN,
                        defaultValue: false,
                },
                password: {
                        type: DataTypes.STRING,
                        allowNull: false,
                },
                username: {
                        type: DataTypes.STRING,
                        allowNull: false,
                },
                email: {
                        type: DataTypes.STRING,
                        allowNull: false,
                },
                avatar: {
                        type: DataTypes.STRING,
                        allowNull: false,
                },
                answeredQuestions: {
                        type: DataTypes.JSON,
                },
                correctAnswered: {
                        type: DataTypes.INTEGER,
                        allowNull: false,
                },
        },
);

export default User;

