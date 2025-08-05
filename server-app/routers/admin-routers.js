import { Router } from 'express';
import { check } from 'express-validator';
import adminController from '../controllers/admin-controller.js';
import AdminRoute from '../constants/routes/admin.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import accessMiddleware from '../middlewares/access-middleware.js';

const router = new Router();

router.get(
    AdminRoute.getUsers,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1})
    ],
    adminController.getUsers
);

router.post(
    AdminRoute.getUser,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1})
    ],
    adminController.getUser
);

router.get(
    AdminRoute.getAllUser,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1})
    ],
    adminController.getAllUser
);

router.get(
    AdminRoute.getTransferTokens,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1})
    ],
    adminController.getTransferTokens
)

router.post(
    AdminRoute.changeRole,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1})
    ],
    adminController.changeRole
);

router.post(
    AdminRoute.createBlogger,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1})
    ],
    adminController.createBlogger
);

router.post(
    AdminRoute.addToken,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1})
    ],
    adminController.addToken
);

router.post(
    AdminRoute.deleteToken,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1})
    ],
    adminController.deleteToken
);

router.post(
    AdminRoute.transferToken,
    [
        authMiddleware,
        accessMiddleware(["admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1})
    ],
    adminController.transferToken
);

export default router;