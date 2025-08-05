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
class AuthService {
    /**
     * Регистрация нового пользователя
     * @param {*} data Информация о пользователе для регистрации
     * @returns Авторизационные данные пользователя
     */
    async signUp(data) {
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
                    title: 'user',
                    priority: 1
                }
            });

            if (!userRole) {
                throw ApiError.InternalServerError("Роли user не существует");
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
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Авторизация пользователя
     * @param {*} data Информация о пользователе для авторизации
     * @returns Авторизационные данные пользователя
     */
    async signIn(data) {
        const t = await db.sequelize.transaction();

        try {
            const user = await db.Users.findOne({ where: { email: data.email } });

            if (!user) {
                throw ApiError.BadRequest(`Аккаунта с почтовым адресом ${data.email} не существует`);
            }

            // Проверка пароля
            const isMatch = await bcrypt.compare(data.password, user.password);
            if (!isMatch) {
                throw ApiError.BadRequest("Неверный пароль, повторите попытку");
            }

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

            // Генерация токенов доступа и обновления
            const tokens = jwtService.generateTokens({
                users_id: user.id,
                roles: roles
            });

            // Сохранение токенов
            await tokenService.saveTokens(user.id, tokens.access_token, tokens.refresh_token, t);

            // Фиксация изменений в БД
            await t.commit();

            return {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Выход пользователя из системы
     * @param {*} data Информация о пользователе
     * @returns Результат выхода из системы пользователя
     */
    async logout(data) {
        const t = await db.sequelize.transaction();

        try {
            const isExists = await tokenService.isExistsUser(data.users_id, data.access_token, data.refresh_token);

            if (!isExists) {
                throw ApiError.BadRequest('Данный пользователь не авторизован');
            }

            await tokenService.removeTokenByUserId(data.users_id, t);
            await t.commit();

            return new SuccessDto(true);
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    /**
     * Обновление токена доступа пользователя
     * @param {RefreshDto} data 
     * @returns Авторизационные данные пользователя
     */
    async refreshToken(data) {
        const t = await db.sequelize.transaction();

        try {
            // Декодирование токена обновления (с пользовательскими данными)
            const user = jwtService.validateRefreshToken(data.refresh_token);

            if (!user) {
                throw ApiError.Forbidden('Необходимо авторизоваться заново');
            }

            // Поиск записи о токене в базе данных по токену
            const tokenExists = await tokenService.findToken(data.refresh_token);

            // Проверка валидности токена
            if (!tokenExists) {
                throw ApiError.NotFound('Записи с данным токеном обновления не обнаружено');
            }

            // Поиск пользователя
            const candidat = await db.Users.findOne({ where: { id: user.users_id } });
            if (!candidat) {
                throw ApiError.NotFound('Пользователя с данным токеном обновления не найдено');
            }

            const userRoles = await db.UsersRoles.findAll({
                where: {
                    users_id: user.users_id
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

            const tokens = jwtService.generateTokens({
                users_id: candidat.id,
                roles: roles
            });

            if (!tokens) {
                throw ApiError.InternalServerError('Токен доступа не был сгенерирован');
            }

            await tokenService.saveTokens(candidat.id, tokens.access_token, tokens.refresh_token, t);

            await t.commit();

            return {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token
            };
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new AuthService();