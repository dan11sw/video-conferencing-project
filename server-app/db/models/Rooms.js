import { genForeignKey } from "../../utils/db.js";

const Rooms = (sequelize, DataTypes) => {
    const model = sequelize.define('rooms', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        uuid: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        is_private: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы rooms, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));

        // Создание внешнего ключа из таблицы messages, на таблицу rooms
        model.hasMany(models.Messages, genForeignKey('rooms_id'));

        // Создание внешнего ключа из таблицы messages, на таблицу rooms_users
        model.hasMany(models.RoomsUsers, genForeignKey('rooms_id'));

        // Создание внешнего ключа из таблицы messages, на таблицу conferences
        model.hasMany(models.Conferences, genForeignKey('rooms_id'));
    };

    return model;
};

export default Rooms;