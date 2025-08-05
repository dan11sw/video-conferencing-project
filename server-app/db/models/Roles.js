import { genForeignKey } from "../../utils/db.js";

const Roles = (sequelize, DataTypes) => {
    const model = sequelize.define('roles', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы roles, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id', true));

        // Создание внешнего ключа из таблицы roles, на таблицу users_roles
        model.hasMany(models.UsersRoles, genForeignKey('roles_id'));
    };

    return model;
};

export default Roles;