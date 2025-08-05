import { genForeignKey } from "../../utils/db.js";

const RoomsUsers = (sequelize, DataTypes) => {
    const model = sequelize.define('rooms_users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы messages, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));

        // Создание внешнего ключа из таблицы messages, на таблицу rooms
        model.belongsTo(models.Rooms, genForeignKey('rooms_id'));
    };

    return model;
};

export default RoomsUsers;