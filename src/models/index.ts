import sequelize from '../utils/sequelize';
import Question from './Question';
import User from './User';
import EasyStat from './EasyStat';
import MediumStat from './MediumStat';
import HardStat from './HardStat';
import CategoryStat from './CategoryStat';

// User.belongsTo(EasyStat, { foreignKey: 'easyStatId' });
// User.belongsTo(MediumStat, { foreignKey: 'mediumStatId' });
// User.belongsTo(HardStat, { foreignKey: 'hardStatId' });
User.belongsTo(EasyStat);
User.belongsTo(MediumStat);
User.belongsTo(HardStat);

EasyStat.hasMany(User);
MediumStat.hasMany(User);
HardStat.hasMany(User);

export {
        sequelize,
        Question,
        User,
        EasyStat,
        MediumStat,
        HardStat,
        CategoryStat,
};

