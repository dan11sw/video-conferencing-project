import { genForeignKey } from "../../utils/db.js";

const TransferTokens = (sequelize, DataTypes) => {
    const model = sequelize.define('transfer_tokens', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        tokens: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });

    model.associate = (models) => {
        // Создание внешнего ключа из таблицы transfer_tokens, на таблицу users
        model.belongsTo(models.Users, genForeignKey('sender_id'));

        // Создание внешнего ключа из таблицы transfer_tokens, на таблицу users
        model.belongsTo(models.Users, genForeignKey('receiver_id'));

        // Создание внешнего ключа из таблицы transfer_tokens, на таблицу purchased_content
        model.hasMany(models.PurchasedContent, genForeignKey('transfer_tokens_id'));
    };

    return model;
};

export default TransferTokens;