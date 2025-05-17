import { DataTypes } from "sequelize";
import sequelize from "../utils/sequelize";

const HardStat = sequelize.define(
        'HardStat',
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

export default HardStat;

