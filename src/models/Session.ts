import { DataTypes, Model, type CreationOptional, type ForeignKey, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import sequelize from 'utils/sequelize';
import type User from './User';

export default class Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
        declare id: CreationOptional<string>;
        // unix time in seconds
        declare expiresAt: number;
        declare UserId: ForeignKey<User['id']>;
};

Session.init(
        {
                id: {
                        type: DataTypes.STRING,
                        primaryKey: true
                },
                expiresAt: {
                        type: DataTypes.INTEGER,
                        allowNull: false
                }
        }, {
        sequelize,
        timestamps: false,
});

