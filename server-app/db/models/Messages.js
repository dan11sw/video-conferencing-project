import { genForeignKey } from "../../utils/db.js";

const Messages = (sequelize, DataTypes) => {
    const model = sequelize.define('messages', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        text: {
            type: DataTypes.STRING(2048),
            defaultValue: true,
            allowNull: false
        },
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы messages, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id', true));

        // Создание внешнего ключа из таблицы messages, на таблицу rooms
        model.belongsTo(models.Rooms, genForeignKey('rooms_id'));
    };

    return model;
};

export default Messages;