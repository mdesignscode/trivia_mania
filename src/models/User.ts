import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const avatar = '/images/icons8-user-64.png';

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
                        unique: true,
                },
                email: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        unique: true,
                },
                avatar: {
                        type: DataTypes.STRING,
                        defaultValue: avatar,
                },
                answeredQuestions: {
                        type: DataTypes.JSON,
                        defaultValue: [],
                },
        },
);

export default User;

