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
                userId: {
                        type: DataTypes.STRING,
                },
                category: {
                        type: DataTypes.STRING,
                },
        },
);

export default CategoryStat;

