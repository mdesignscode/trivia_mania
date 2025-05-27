import sequelize from '../utils/sequelize';
import Question from './Question';
import User from './User';
import EasyStat from './EasyStat';
import MediumStat from './MediumStat';
import HardStat from './HardStat';
import CategoryStat from './CategoryStat';
import Session from './Session';
import EmailVerification from './EmailVerification';

User.belongsTo(EasyStat);
User.belongsTo(MediumStat);
User.belongsTo(HardStat);

EasyStat.hasMany(User);
MediumStat.hasMany(User);
HardStat.hasMany(User);

Session.belongsTo(User);
User.hasMany(Session);

export {
        sequelize,
        Question,
        User,
        EasyStat,
        MediumStat,
        HardStat,
        CategoryStat,
        Session,
        EmailVerification,
};

