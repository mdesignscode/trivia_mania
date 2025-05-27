import { DataTypes } from 'sequelize';
import sequelize from '../utils/sequelize';

const Session = sequelize.define('Session', {
        id: {
                type: DataTypes.STRING,
                primaryKey: true
        },
        expiresAt: {
                type: DataTypes.INTEGER,
                allowNull: false
        }
}, {
        timestamps: false,
});

export default Session;

