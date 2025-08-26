import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import sequelize from 'utils/sequelize';

export default class EmailVerification extends Model<InferAttributes<EmailVerification>, InferCreationAttributes<EmailVerification>> {
        declare id: CreationOptional<string>;
        declare email: string;
        declare code: string;
        declare expiresAt: Date;
        declare used: CreationOptional<boolean>;
};

EmailVerification.init(
        {
                id: {
                        type: DataTypes.UUID,
                        defaultValue: DataTypes.UUIDV4,
                        primaryKey: true,
                },
                email: {
                        type: DataTypes.STRING,
                        allowNull: false,
                },
                code: {
                        type: DataTypes.STRING,
                        allowNull: false,
                },
                expiresAt: {
                        type: DataTypes.DATE,
                        allowNull: false,
                },
                used: {
                        type: DataTypes.BOOLEAN,
                        defaultValue: false,
                }
        }, {
        timestamps: true,
        sequelize,
}
)

