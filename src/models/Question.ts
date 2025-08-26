import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize';
import sequelize from 'utils/sequelize';


export default class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
        declare id: CreationOptional<number>;
        declare category: string;
        declare answers: string[];
        declare correctAnswer: string;
        declare question: string;
        declare difficulty: string;
};
export type TQuestionAttributes = InferAttributes<Question>;

Question.init(
        {
                id: {
                        type: DataTypes.INTEGER,
                        autoIncrement: true,
                        primaryKey: true,
                },
                category: {
                        type: DataTypes.STRING,
                        allowNull: false,
                },
                answers: {
                        type: DataTypes.JSON,
                        allowNull: false,
                },
                correctAnswer: {
                        type: DataTypes.STRING,
                        allowNull: false,
                },
                question: {
                        type: DataTypes.STRING,
                        allowNull: false,
                        unique: true,
                },
                difficulty: {
                        type: DataTypes.STRING,
                        allowNull: false,
                },
        }, {
        sequelize
}
);

