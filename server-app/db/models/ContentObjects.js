import { genForeignKey } from "../../utils/db.js";

const ContentObjects = (sequelize, DataTypes) => {
    const model = sequelize.define('content_objects', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        filename: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ext: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы content_objects, на таблицу content_sales
        model.belongsTo(models.ContentSales, genForeignKey('content_sales_id'));
    };

    return model;
};

export default ContentObjects;