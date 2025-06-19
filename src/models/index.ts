import sequelize from '../utils/sequelize';
import Question from './Question';
import CategoryStat from './CategoryStat';
import User from './User';
import Session from './Session';
import EmailVerification from './EmailVerification';
import UserStats from './UserStats';

Session.belongsTo(User);

User.hasMany(Session);
User.hasOne(UserStats);

UserStats.hasMany(CategoryStat);
UserStats.belongsTo(User);

CategoryStat.belongsTo(UserStats);

export {
        sequelize,
        Question,
        User,
        CategoryStat,
        Session,
        EmailVerification,
        UserStats,
};

