import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const MediumStat = sequelize.define(
        'MediumStat',
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

export default MediumStat;

