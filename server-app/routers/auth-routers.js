import { Router } from 'express';
import { check } from 'express-validator';
import authController from '../controllers/auth-controller.js';
import AuthRoute from '../constants/routes/auth.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import LogoutDto from '../dtos/auth/logout-dto.js';
import RefreshDto from '../dtos/auth/refresh-dto.js';

const router = new Router();

/**
 * Регистрация пользователя
 * @route POST /auth/sign-up
 * @group Авторизация (пользователь) - Функции для авторизации пользователя
 * @param {SignUpDto.model} input.body.required Входные данные
 * @returns {AuthDto.model} 201 - Авторизационные данные пользователя
 * @returns {ApiError.model} default - Ошибка запроса
 */
router.post(
    AuthRoute.signUp,
    [
        check('email', 'Введите корректный email').isEmail(),
        check('password', 'Минимальная длина пароля должна быть 6 символов, а максимальная длина пароля - 32 символа')
            .isLength({ min: 6, max: 32 }),
        check('nickname', 'Минимальная длина для никнейма равна 2 символам')
            .isLength({ min: 2 })
    ],
    authController.signUp
);

/**
 * Авторизация пользователя
 * @route POST /auth/sign-in
 * @group Авторизация (пользователь) - Функции для авторизации пользователя
 * @param {SignInDto.model} input.body.required Входные данные
 * @returns {AuthDto.model} 200 - Авторизационные данные пользователя
 * @returns {ApiError.model} default - Ошибка запроса
 */
router.post(
    AuthRoute.signIn,
    [
        check('email', 'Введите корректный email').isEmail(),
        check('password', 'Минимальная длина пароля должна быть 6 символов, а максимальная длина пароля - 32 символа')
            .isLength({ min: 6, max: 32 }),
    ],
    authController.signIn
);

/**
 * Выход пользователя из системы
 * @route POST /auth/logout
 * @group Авторизация (пользователь) - Функции для авторизации пользователя
 * @param {LogoutDto.model} input.body.required Входные данные
 * @returns {SuccessDto.model} 200 - Флаг, определяющий успех операции выхода пользователя из системы
 * @returns {ApiError.model} default - Ошибка запроса
 */
router.post(
    AuthRoute.logout,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1})
    ],
    authController.logout
);

/**
 * Обновление токена доступа
 * @route POST /auth/refresh/token
 * @group Авторизация (пользователь) - Функции для авторизации пользователя
 * @param {RefreshDto.model} input.body.required - Входные данные
 * @returns {AuthDto.model} 201 - Авторизационные данные пользователя
 * @returns {ApiError.model} default - Ошибка запроса
 */
router.post(
    AuthRoute.refreshToken,
    authController.refreshToken
);

/**
 * Верификация пользователя
 * @route POST /auth/verification
 * @group Авторизация (пользователь) - Функции для авторизации пользователя
 * @returns {FlagDto.model} 200 - Флаг, показывающий статус пользователя
 * @returns {ApiError.model} default - Ошибка запроса
 */
router.post(
    AuthRoute.verification,
    [
        authMiddleware,
    ],
    authController.verification
);

export default router;