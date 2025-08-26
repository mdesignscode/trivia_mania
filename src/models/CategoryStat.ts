import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import sequelize from 'utils/sequelize';
import type UserStats from './UserStats';

export default class CategoryStat extends Model<InferAttributes<CategoryStat>, InferCreationAttributes<CategoryStat>> {
        declare id: CreationOptional<number>;
        declare category: string;
        declare total: CreationOptional<number>;
        declare totalCorrect: CreationOptional<number>;
        declare totalEasy: CreationOptional<number>;
        declare totalEasyCorrect: CreationOptional<number>;
        declare totalMedium: CreationOptional<number>;
        declare totalMediumCorrect: CreationOptional<number>;
        declare totalHard: CreationOptional<number>;
        declare totalHardCorrect: CreationOptional<number>;
        declare UserStatId: ForeignKey<UserStats['id']>;
};
export type TCategoryStatAttributes = InferAttributes<CategoryStat>;

CategoryStat.init(
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
        sequelize,
        indexes: [
                {
                        unique: true,
                        fields: ['userStatId', 'category'],
                },
        ],
        timestamps: false,
}
);

