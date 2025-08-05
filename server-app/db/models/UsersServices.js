import { genForeignKey } from "../../utils/db.js";

const UsersServices = (sequelize, DataTypes) => {
    const model = sequelize.define('users_services', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        time_limit: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        count_limit: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы services, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));

        // Создание внешнего ключа из таблицы services, на таблицу services
        model.belongsTo(models.Services, genForeignKey('services_id'));
    };

    return model;
};


export default UsersServices;