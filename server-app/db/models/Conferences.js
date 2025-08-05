import { genForeignKey } from "../../utils/db.js";

const ContentSales = (sequelize, DataTypes) => {
    const model = sequelize.define('conferences', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        link: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы conferences, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));

        // Создание внешнего ключа из таблицы conferences, на таблицу rooms
        model.belongsTo(models.Rooms, genForeignKey('rooms_id'));
    };

    return model;
};

export default ContentSales;