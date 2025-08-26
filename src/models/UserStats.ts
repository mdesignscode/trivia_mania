import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import sequelize from 'utils/sequelize';
import type User from './User';

export default class UserStats extends Model<InferAttributes<UserStats>, InferCreationAttributes<UserStats>> {
        declare id: CreationOptional<string>;
        declare total: CreationOptional<number>;
        declare totalCorrect: CreationOptional<number>;
        declare UserId: ForeignKey<User['id']>;
};

export type TUserStatsAttributes = InferAttributes<UserStats>;

UserStats.init(
        {
                id: {
                        type: DataTypes.INTEGER,
                        autoIncrement: true,
                        primaryKey: true,
                },
                total: {
                        type: DataTypes.INTEGER,
                        defaultValue: 0,
                },
                totalCorrect: {
                        type: DataTypes.INTEGER,
                        defaultValue: 0,
                },
        }, {
        sequelize,
}
);

