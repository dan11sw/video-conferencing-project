import { genForeignKey } from "../../utils/db.js";

const ContentSales = (sequelize, DataTypes) => {
    const model = sequelize.define('content_sales', {
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
        path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы content_sales, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));

        // Создание внешнего ключа из таблицы content_sales, на таблицу content_objects
        model.hasMany(models.ContentObjects, genForeignKey('content_sales_id'));
    };

    return model;
};

export default ContentSales;