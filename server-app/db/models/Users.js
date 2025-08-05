import { genForeignKey } from "../../utils/db.js";

const Users = (sequelize, DataTypes) => {
    const model = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    model.associate = (models) => {
        // Создание отношения одного (users) ко  (users_roles)
        model.hasMany(models.UsersRoles, genForeignKey('users_id'));

        // Создание отношения одного (users) ко  (roles)
        model.hasMany(models.Roles, genForeignKey('users_id', true));

        // Создание отношения одного (users) ко  (users_roles)
        model.hasMany(models.UsersData, genForeignKey('users_id'));

        // Создание отношения одного (users) ко  (tokens)
        model.hasMany(models.Tokens, genForeignKey('users_id'));

        // Создание отношения одного (users) ко  (transfer_tokens)
        model.hasMany(models.TransferTokens, genForeignKey('sender_id'));

        // Создание отношения одного (users) ко  (transfer_tokens)
        model.hasMany(models.TransferTokens, genForeignKey('receiver_id'));

        // Создание отношения одного (users) ко  (content_sales)
        model.hasMany(models.ContentSales, genForeignKey('users_id'));

        // Создание отношения одного (users) ко  (purchased_content)
        model.hasMany(models.PurchasedContent, genForeignKey('users_id'));

        // Создание отношения одного (users) ко  (rooms)
        model.hasMany(models.Rooms, genForeignKey('users_id'));

        // Создание отношения одного (users) ко  (conferences)
        model.hasMany(models.Conferences, genForeignKey('users_id'));

        // Создание отношения одного (users) ко многим (messages)
        model.hasMany(models.Messages, genForeignKey('users_id', true))

        // Создание отношения одного (users) ко многим (services)
        model.hasMany(models.Services, genForeignKey('users_id', true))

        // Создание отношения одного (users) ко многим (users_services)
        model.hasMany(models.UsersServices, genForeignKey('users_id'))
    }

    return model;
};

export default Users;