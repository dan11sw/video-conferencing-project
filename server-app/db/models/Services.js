import { genForeignKey } from "../../utils/db.js";

const Services = (sequelize, DataTypes) => {
    const model = sequelize.define('services', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы services, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id', true));

        // Создание отношения одного (services) ко многим (users_services)
        model.hasMany(models.UsersServices, genForeignKey('services_id'))
    };

    return model;
};


export default Services;