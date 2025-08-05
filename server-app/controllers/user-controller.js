import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import userService from "../services/user/user-service.js";
import config from "config";

/* Контроллер авторизации */
class UserController {
    async profile(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userService.profile(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async getContent(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userService.getContent(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async accountRefill(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userService.accountRefill(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async buyContent(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await userService.buyContent(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }
}

export default new UserController();