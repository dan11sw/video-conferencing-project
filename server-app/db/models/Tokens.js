import { genForeignKey } from "../../utils/db.js";

const Tokens = (sequelize, DataTypes) => {
    const model = sequelize.define('tokens', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        access_token: {
            type: DataTypes.STRING(1024),
            allowNull: false,
        },
        refresh_token: {
            type: DataTypes.STRING(1024),
            allowNull: false,
        },
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы tokens, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));
    };

    return model;
};

export default Tokens;