import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import sequelize from 'utils/sequelize';

export default class Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
        declare id: CreationOptional<string>;
        declare expiresAt: Date;
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

