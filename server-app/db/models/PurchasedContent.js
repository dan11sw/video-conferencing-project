import { genForeignKey } from "../../utils/db.js";

const PurchasedContent = (sequelize, DataTypes) => {
    const model = sequelize.define('purchased_content', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        }
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы purchased_content, на таблицу users
        model.belongsTo(models.Users, genForeignKey('users_id'));

        // Создание внешнего ключа из таблицы purchased_content, на таблицу content_sales
        model.belongsTo(models.ContentSales, genForeignKey('content_sales_id'));

        // Создание внешнего ключа из таблицы purchased_content, на таблицу transfer_tokens
        model.belongsTo(models.TransferTokens, genForeignKey('transfer_tokens_id'));
    };

    return model;
};

export default PurchasedContent;