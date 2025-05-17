import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const User = sequelize.define(
        'User',
        {
                id: {
                        type: DataTypes.UUID,
                        primaryKey: true,
                },
                username: {
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

                // difficulty relationships
                // easyStatId: {
                //         type: DataTypes.INTEGER
                // },
                // hardStatId: {
                //         type: DataTypes.INTEGER
                // },
                // mediumStatId: {
                //         type: DataTypes.INTEGER
                // },
        },
);

export default User;

