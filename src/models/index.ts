import sequelize from 'utils/sequelize';
import CategoryStat from './CategoryStat';
import type { TCategoryStatAttributes } from './CategoryStat';
import { type TNewStatsInput, NewStatsSchema, CategoryStatSchema } from './CategoryStatSchema';
import Question from './Question';
import type { TQuestionAttributes } from './Question';
import User from './User';
import type { TUser, TUserAttributes } from './User';
import Session from './Session';
import EmailVerification from './EmailVerification';
import UserStats from './UserStats';
import type { TUserStatsAttributes } from './UserStats';

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
        CategoryStatSchema,
        NewStatsSchema,
};

export type {
        TQuestionAttributes,
        TUserAttributes,
        TUser,
        TUserStatsAttributes,
        TCategoryStatAttributes,
        TNewStatsInput,
};

