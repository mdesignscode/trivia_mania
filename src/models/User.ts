import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import sequelize from 'utils/sequelize';
import type { TQuestionAttributes } from './Question';

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
        declare id: CreationOptional<string>;
        declare isVerified: CreationOptional<boolean>;
        declare avatar: CreationOptional<string>;
        declare password: string;
        declare username: string;
        declare email: string;
        declare answeredQuestions: CreationOptional<(TQuestionAttributes['id'])[]>;
};
export type TUserAttributes = InferAttributes<User>;
export type TUser = User;

const avatar = '/images/icons8-user-64.png';

User.init(
        {
                id: {
                        type: DataTypes.UUID,
                        defaultValue: DataTypes.UUIDV4,
                        primaryKey: true,
                },
                isVerified: {
                        type: DataTypes.BOOLEAN,
                        defaultValue: false,
                },
                password: {
                        type: DataTypes.STRING,
                        allowNull: false,
                },
                username: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        unique: true,
                },
                email: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        unique: true,
                        set(email: string) {
                                const lowerEmail = email.toLowerCase();
                                this.setDataValue('email', lowerEmail);
                        },
                },
                avatar: {
                        type: DataTypes.STRING,
                        defaultValue: avatar,
                },
                answeredQuestions: {
                        type: DataTypes.JSON,
                        defaultValue: [],
                },
        }, {
        sequelize,
}
);

