import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const EasyStat = sequelize.define(
        'EasyStat',
        {
                id: {
                        type: DataTypes.INTEGER,
                        autoIncrement: true,
                        primaryKey: true,
                },
                users: {
                        type: DataTypes.JSON,
                },
        },
);

export default EasyStat;

