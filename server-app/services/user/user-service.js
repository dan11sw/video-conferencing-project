import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import config from 'config';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import db from '../../db/index.js';
import tokenService from '../token/token-service.js';
import jwtService from '../token/jwt-service.js';
import ApiError from '../../exceptions/api-error.js';
import SuccessDto from '../../dtos/response/success-dto.js';
import RefreshDto from '../../dtos/auth/refresh-dto.js';
import RoleDto from '../../dtos/auth/role-dto.js';

/* Сервис авторизации пользователей */
class UserService {
    /**
     * Получение информации о пользователе
     * @param {*} data Данные пользователя
     * @returns Информация о пользователе
     */
    async profile(data) {
        try {
            const { users_id } = data;

            const usersData = await db.UsersData.findOne({
                where: {
                    users_id: users_id
                }
            });

            if (!usersData) {
                throw ApiError.NotFound("Данных пользователя не найдено");
            }

            const user = await db.Users.findOne({
                where: {
                    id: users_id
                }
            });

            return {
                id: usersData.users_id,
                nickname: usersData.nickname,
                tokens: usersData.tokens,
                email: user.email
            }
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение контента
     * @param {*} data Входные данные пользователя
     * @returns 
     */
    async getContent(data) {
        try {
            const { users_id } = data;
            const contents = await db.ContentSales.findAll({
                include: {
                    model: db.ContentObjects
                }
            });

            contents.forEach((item) => {
                item.path = `${config.get("url.api")}/${item.path}`;

                item.content_objects.forEach((object) => {
                    object.path = `${config.get("url.api")}/${object.path}`;
                });
            });

            for (let i = 0; i < contents.length; i++) {
                const content = contents[i];

                const purchased = await db.PurchasedContent.findOne({
                    where: {
                        content_sales_id: content.id,
                        users_id: users_id
                    }
                });

                if (purchased) {
                    contents[i].dataValues.is_buy = true;
                } else if (content.users_id === users_id) {
                    contents[i].dataValues.is_buy = true;
                } else {
                    contents[i].dataValues.is_buy = false;
                }
            }

            return contents;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Пополнение счёта
     * @param {*} data Входные данные пользователя
     * @returns 
     */
    async accountRefill(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, tokens } = data;

            const usersData = await db.UsersData.findOne({
                where: {
                    users_id: users_id
                },
                transaction: t
            });

            usersData.tokens = usersData.tokens + Number(tokens);
            await usersData.save();

            await t.commit();

            return usersData;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Покупка контента
     * @param {*} data Входные данные пользователя
     * @returns 
     */
    async buyContent(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, content_sales_id } = data;

            const contentSale = await db.ContentSales.findOne({
                where: {
                    id: content_sales_id
                }
            });

            const usersData = await db.UsersData.findOne({
                where: {
                    users_id: users_id
                }
            }, { transaction: t });

            if(contentSale.price > usersData.tokens){
                throw ApiError.BadRequest("Недостаточно средств");
            }

            const transfer = await db.TransferTokens.create({
                receiver_id: contentSale.users_id,
                sender_id: users_id,
                tokens: contentSale.price
            }, { transaction: t});

            await db.PurchasedContent.create({
                users_id: users_id,
                content_sales_id: content_sales_id,
                transfer_tokens_id: transfer.id
            }, { transaction: t });

            usersData.tokens = usersData.tokens - contentSale.price;
            await usersData.save();

            await t.commit();

            return usersData;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new UserService();