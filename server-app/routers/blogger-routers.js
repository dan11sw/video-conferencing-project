import { Router } from 'express';
import { check } from 'express-validator';
import bloggerController from '../controllers/blogger-controller.js';
import BloggerRoute from '../constants/routes/blogger.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import converterTypeMiddleware from '../middlewares/converter-type-middleware.js';
import { v4 as uuid } from 'uuid';
import multer from 'multer';
import accessMiddleware from '../middlewares/access-middleware.js';

// Конфигурирование файлового хранилища multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.');
        const extFile = ext[ext.length - 1];

        cb(null, `${uuid()}.${extFile}`);
    }
});

const upload = multer({ storage: storage });

const router = new Router();

const createContentUpload = upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'objects', maxCount: 24 }]);
router.post(
    BloggerRoute.createContent,
    [
        authMiddleware,
        accessMiddleware(["blogger", "admin"]),
        createContentUpload,
        authMiddleware,
        converterTypeMiddleware("price", "number"),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    bloggerController.createContent
);

const updateContentUpload = upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'objects', maxCount: 24 }]);
router.post(
    BloggerRoute.updateContent,
    [
        authMiddleware,
        accessMiddleware(["blogger", "admin"]),
        updateContentUpload,
        authMiddleware,
        converterTypeMiddleware("price", "number"),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    bloggerController.updateContent
);


router.get(
    BloggerRoute.getContent,
    [
        authMiddleware,
        accessMiddleware(["blogger", "admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    bloggerController.getContent
);

router.post(
    BloggerRoute.getAllServices,
    [
        authMiddleware,
        accessMiddleware(["blogger", "admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('blogger_id', 'Некорректный идентификатор блогера').isInt({ min: 1 })
    ],
    bloggerController.getAllServices
);

router.post(
    BloggerRoute.getCurrentServices,
    [
        authMiddleware,
        accessMiddleware(["blogger", "admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('blogger_id', 'Некорректный идентификатор блогера').isInt({ min: 1 })
    ],
    bloggerController.getCurrentServices
);

router.post(
    BloggerRoute.deleteServices,
    [
        authMiddleware,
        accessMiddleware(["blogger", "admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('blogger_id', 'Некорректный идентификатор блогера').isInt({ min: 1 }),
        check('services_id', 'Некорректный идентификатор услуги').isInt({ min: 1 })
    ],
    bloggerController.deleteServices
);

router.post(
    BloggerRoute.addServices,
    [
        authMiddleware,
        accessMiddleware(["blogger", "admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('blogger_id', 'Некорректный идентификатор блогера').isInt({ min: 1 }),
        check('services_id', 'Некорректный идентификатор услуги').isInt({ min: 1 })
    ],
    bloggerController.addService
);

router.post(
    BloggerRoute.editServices,
    [
        authMiddleware,
        accessMiddleware(["blogger", "admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 }),
        check('blogger_id', 'Некорректный идентификатор блогера').isInt({ min: 1 }),
        check('services_id', 'Некорректный идентификатор услуги').isInt({ min: 1 })
    ],
    bloggerController.editService
);

router.post(
    BloggerRoute.deleteContent,
    [
        authMiddleware,
        accessMiddleware(["blogger", "admin"]),
        check('users_id', 'Некорректный идентификатор пользователя').isInt({ min: 1 })
    ],
    bloggerController.deleteContent
);


export default router;