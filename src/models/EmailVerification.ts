import { DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize';

const EmailVerification = sequelize.define('EmailVerification', {
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
        },
}, {
        timestamps: true,
});

export default EmailVerification;

