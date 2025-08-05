import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";
import config from "config";
import bloggerService from "../services/blogger/blogger-service.js";
import BloggerIdDto from "../dtos/blogger/blogger-id-dto.js.js";

/**
 * Контроллер для функций блогера
 */
class BloggerController {
    async createContent(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await bloggerService.createContent(req.body, req.files['objects'], req.files['logo'][0]);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async updateContent(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const logo = (req.files['logo'])? req.files['logo'][0] : null;
            const data = await bloggerService.updateContent(req.body, logo);

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

            const data = await bloggerService.getContent(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async deleteContent(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await bloggerService.deleteContent(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async getAllServices(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await bloggerService.getAllServices(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async getCurrentServices(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }


            const data = await bloggerService.getCurrentServices(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async deleteServices(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await bloggerService.deleteService(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async addService(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await bloggerService.addService(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    async editService(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Некорректные входные данные', errors.array()));
            }

            const data = await bloggerService.editService(req.body);

            return res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }
}

export default new BloggerController();