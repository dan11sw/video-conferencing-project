import { Router } from 'express';
import { check } from 'express-validator';
import userController from '../controllers/user-controller.js';
import UserRoute from '../constants/routes/user.js';
import authMiddleware from '../middlewares/auth-middleware.js';

const router = new Router();

router.get(
    UserRoute.profile,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1})
    ],
    userController.profile
);

router.get(
    UserRoute.getContent,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1})
    ],
    userController.getContent
);

router.post(
    UserRoute.accountRefill,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1}),
        check('tokens', 'Некорректное число токенов').isInt({ min: 1})
    ],
    userController.accountRefill
);

router.post(
    UserRoute.buyContent,
    [
        authMiddleware,
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1})
    ],
    userController.buyContent
);

export default router;