import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import adminService from "../services/admin/admin-service.js";
import config from "config";
import SignUpDto from "../dtos/auth/sign-up-dto.js";
import UserIdDto from "../dtos/admin/user-id-dto.js.js";
import UserTransferDto from "../dtos/admin/user-transfer-dto.js";

/* Контроллер авторизации */
class AdminController {
    async getUsers(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.getUsers(req.body);

            return res.status(200).json(data);
        } catch (e) {
            next(e);
        }
    }

    async getUser(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const input = new UserIdDto(req.body);
            const data = await adminService.getUser(input);

            return res.status(200).json(data);
        } catch (e) {
            next(e);
        }
    }

    async getAllUser(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.getAllUser(req.body);

            return res.status(200).json(data);
        } catch (e) {
            next(e);
        }
    }

    async changeRole(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.changeRole(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async createBlogger(req, res, next) {
        try {
            // Проверяем корректность входных данных
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const body = new SignUpDto(req.body);
            const data = await adminService.createBlogger(body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async getTransferTokens(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await adminService.getTransferTokens(req.body);

            return res.status(200).json(data);
        } catch (e) {
            next(e);
        }
    }

    /* Операции с токенами */
    async addToken(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const input = new UserTransferDto(req.body);
            const data = await adminService.addToken(input);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async deleteToken(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const input = new UserTransferDto(req.body);
            const data = await adminService.deleteToken(input);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async transferToken(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const input = new UserTransferDto(req.body);
            const data = await adminService.transferToken(input);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }
}

export default new AdminController();