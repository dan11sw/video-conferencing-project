import { genForeignKey } from "../../utils/db.js";

const UsersData = (sequelize, DataTypes) => {
    const model = sequelize.define('users_data', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        tokens: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы users_data, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));
    };

    return model;
};

export default UsersData;