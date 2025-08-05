import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import config from 'config';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import db from '../../db/index.js';
import ApiError from '../../exceptions/api-error.js';
import UserInfoDto from '../../dtos/admin/user-info-dto.js';
import RoleDto from '../../dtos/auth/role-dto.js';
import UserDto from '../../dtos/admin/user-dto.js';
import jwtService from '../token/jwt-service.js';
import tokenService from '../token/token-service.js';

class AdminService {
    async getUsers(data) {
        try {
            const { users_id } = data;

            const usersData = await db.Users.findAll({
                include: {
                    model: db.UsersData,
                    where: {
                        users_id: {
                            [db.Sequelize.Op.ne]: users_id
                        }
                    }
                }
            });

            const users = [];
            for (let i = 0; i < usersData.length; i++) {
                const user = usersData[i];

                const userRoles = await db.UsersRoles.findAll({
                    where: {
                        users_id: user.id
                    }
                });

                if (!userRoles) {
                    throw ApiError.InternalServerError("У пользователя нет ролей");
                }

                const roles = [];
                for (let i = 0; i < userRoles.length; i++) {
                    const role = await db.Roles.findOne({
                        where: {
                            id: userRoles[i].roles_id
                        }
                    });

                    if (role) {
                        roles.push(new RoleDto(role));
                    }
                }

                users.push(new UserInfoDto({
                    ...user.dataValues,
                    ...user.dataValues.users_data,
                    ...user.dataValues.users_data[0].dataValues,
                    roles: roles
                }));
            }

            return users;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Информация о пользователе
     * @param {*} data Данные для смены роли пользователя
     * @returns Информация о пользователе
     */
    async changeRole(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                users_id_goal,
                old_role_title,
                new_role_title
            } = data;

            const userGoal = await db.Users.findOne({
                where: {
                    id: users_id_goal
                }
            });

            if (!userGoal) {
                throw ApiError.NotFound(`Аккаунта с идентификатором ${users_id_goal} не существует`);
            }

            const oldRole = await db.Roles.findOne({
                where: {
                    title: old_role_title
                }
            });

            if (!oldRole) {
                throw ApiError.NotFound(`Роли с названием ${old_role_title} не существует`);
            }

            const newRole = await db.Roles.findOne({
                where: {
                    title: new_role_title
                }
            });

            if (!newRole) {
                throw ApiError.NotFound(`Роли с названием ${new_role_title} не существует`);
            }

            await db.UsersRoles.destroy({
                where: {
                    roles_id: oldRole.id,
                    users_id: users_id_goal
                }
            }, { transaction: t });

            await db.UsersRoles.create({
                users_id: users_id_goal,
                roles_id: newRole.id
            }, { transaction: t });

            // Фиксация изменений в БД
            await t.commit();

            return {
                users_id,
                users_id_goal,
                old_role_title,
                new_role_title
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Добавление токенов пользователю
     * @param {*} data Информация для добавления токенов
     * @returns 
     */
    async addToken(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                receiver_id,
                tokens
            } = data;

            const usersData = await db.UsersData.findOne({
                where: {
                    users_id: receiver_id
                }
            }, { transaction: t });

            if (!usersData) {
                throw ApiError.NotFound(`Аккаунта с идентификатором ${receiver_id} не существует`);
            }

            usersData.tokens = usersData.tokens + tokens;
            await usersData.save();

            const transfer = await db.TransferTokens.create({
                receiver_id: receiver_id,
                sender_id: users_id,
                tokens: tokens
            }, { transaction: t });

            // Фиксация изменений в БД
            await t.commit();

            return transfer;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
    * Удаление токенов пользователя
    * @param {*} data Информация для удаления токенов
    * @returns 
    */
    async deleteToken(data) {
        const t = await db.sequelize.transaction();

        try {
            let {
                users_id,
                receiver_id,
                tokens
            } = data;

            if(tokens < 0){
                tokens = -tokens;
            }

            const usersData = await db.UsersData.findOne({
                where: {
                    users_id: receiver_id
                }
            }, { transaction: t });

            if (!usersData) {
                throw ApiError.NotFound(`Аккаунта с идентификатором ${receiver_id} не существует`);
            }

            usersData.tokens = usersData.tokens - tokens;
            await usersData.save();

            const transfer = await db.TransferTokens.create({
                receiver_id: receiver_id,
                sender_id: users_id,
                tokens: (-tokens)
            }, { transaction: t });

            // Фиксация изменений в БД
            await t.commit();

            return transfer;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Перенос токенов с одного аккаунта на другой
     * @param {*} data Информация для переноса токенов
     * @returns 
     */
    async transferToken(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                sender_id,
                receiver_id,
                tokens
            } = data;

            // Данные получателя токенов
            const usersDataReceiver = await db.UsersData.findOne({
                where: {
                    users_id: receiver_id
                }
            }, { transaction: t });

            if (!usersDataReceiver) {
                throw ApiError.NotFound(`Аккаунта с идентификатором ${receiver_id} не существует`);
            }

            // Данные отправителя токенов
            const usersDataSender = await db.UsersData.findOne({
                where: {
                    users_id: sender_id
                }
            }, { transaction: t });

            if (!usersDataSender) {
                throw ApiError.NotFound(`Аккаунта с идентификатором ${sender_id} не существует`);
            }

            // Процесс передачи токенов (с возможностью отриацтельного баланса отдающей стороне)
            if (usersDataSender.tokens < 0) {
                usersDataSender.tokens = usersDataSender.tokens + tokens;
            } else {
                usersDataSender.tokens = usersDataSender.tokens - tokens;
            }
            await usersDataSender.save();

            usersDataReceiver.tokens = usersDataReceiver.tokens + tokens;
            await usersDataReceiver.save();

            // Фиксация передачи токенов в журнале транзакций
            const transfer = await db.TransferTokens.create({
                receiver_id: receiver_id,
                sender_id: sender_id,
                tokens: tokens
            }, { transaction: t });

            // Фиксация изменений в БД
            await t.commit();

            return transfer;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Создание нового блогера
     * @param {*} data Данные для создания блогера
     * @returns Информация о блогере
     */
    async createBlogger(data) {
        const t = await db.sequelize.transaction();

        try {
            const userEmail = await db.Users.findOne({ where: { email: data.email } });
            const userNick = await db.UsersData.findOne({ where: { nickname: data.nickname } });

            if ((userEmail) || (userNick)) {
                const message = (userEmail) ? `Пользователь с почтовым адресом ${data.email} уже существует`
                    : `Пользователь с никнеймом ${data.nickname} уже существует`;

                throw ApiError.BadRequest(message);
            }


            const userRole = await db.Roles.findOne({
                where: {
                    title: 'blogger',
                    priority: 2
                }
            });

            if (!userRole) {
                throw ApiError.InternalServerError("Роли blogger не существует");
            }

            // Хэширование пароля
            const hashedPassword = await bcrypt.hash(data.password, 16);
            const user = await db.Users.create({
                email: data.email,
                password: hashedPassword
            }, { transaction: t });

            // Добавление пользователю роли
            const usersRoles = await db.UsersRoles.create({
                users_id: user.id,
                roles_id: userRole.id
            }, { transaction: t });

            // Генерация токенов доступа и обновления
            const tokens = jwtService.generateTokens({
                users_id: user.id,
                roles: [
                    new RoleDto(userRole)
                ]
            });

            // Сохранение токенов в БД
            await tokenService.saveTokens(user.id, tokens.access_token, tokens.refresh_token, t);

            // Добавление информации о пользователе
            await db.UsersData.create({
                users_id: user.id,
                nickname: data.nickname,
                tokens: 0
            }, { transaction: t });

            // Фиксация изменений в БД
            await t.commit();

            return {
                users_id: user.id,
                nickname: data.nickname,
                email: data.email,
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение информации о пользователе
     * @param {*} data Данные для получения информации о пользователе
     */
    async getUser(data) {
        try {
            const { user_id } = data;

            // Получение информации о текущем пользователе
            const user = await db.UsersRoles.findOne({
                attributes: [],
                include: {
                    attributes: ["id", "email", "created_at"],
                    model: db.Users,
                    where: {
                        id: user_id
                    },
                    include: {
                        attributes: ["tokens", "nickname"],
                        model: db.UsersData
                    }
                }
            });

            // Получение информации о транзакциях
            const transferTokens = await db.TransferTokens.findAll({
                where: {
                    [db.Sequelize.Op.or]: [
                        { sender_id: user.user.id },
                        { receiver_id: user.user.id }
                    ]
                }
            });

            for (let i = 0; i < transferTokens.length; i++) {
                const transfer = transferTokens[i];
                const senderInfo = await db.Users.findOne({
                    where: {
                        id: transfer.sender_id
                    },
                    include: {
                        model: db.UsersData,
                    }
                });
                const receiverInfo = await db.Users.findOne({
                    where: {
                        id: transfer.receiver_id
                    },
                    include: {
                        model: db.UsersData,
                    }
                });

                transferTokens[i].dataValues.sender_info = new UserDto(senderInfo);
                transferTokens[i].dataValues.receiver_info = new UserDto(receiverInfo);
            }

            user.dataValues.transfers = transferTokens;

            const usersRoles = await db.Roles.findAll({
                attributes: ["id", "title", "priority"],
                include: {
                    model: db.UsersRoles,
                    where: {
                        users_id: user_id
                    }
                }
            });

            user.dataValues.roles = usersRoles;

            return user;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение списка блогеров
     * @param {*} data Данные для получения списка блогеров
     */
    async getAllUser(data) {
        try {
            const bloggers = await db.UsersRoles.findAll({
                attributes: [],
                order: [
                    ["created_at", "DESC"]
                ],
                include: [
                    {
                        attributes: ["id", "email", "created_at"],
                        model: db.Users,
                        include: {
                            attributes: ["tokens", "nickname"],
                            model: db.UsersData
                        }
                    }
                ]
            });

            return bloggers;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Получение информации о журнале транзакций
     * @param {*} data Данные для получение информации о журнале транзакций
     * @returns 
     */
    async getTransferTokens(data) {
        try {
            const transferTokens = await db.TransferTokens.findAll();

            for (let i = 0; i < transferTokens.length; i++) {
                const transfer = transferTokens[i];
                const senderInfo = await db.Users.findOne({
                    where: {
                        id: transfer.sender_id
                    },
                    include: {
                        model: db.UsersData,
                    }
                });
                const receiverInfo = await db.Users.findOne({
                    where: {
                        id: transfer.receiver_id
                    },
                    include: {
                        model: db.UsersData,
                    }
                });

                transferTokens[i].dataValues.sender_info = new UserDto(senderInfo);
                transferTokens[i].dataValues.receiver_info = new UserDto(receiverInfo);
            }

            return transferTokens;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new AdminService();