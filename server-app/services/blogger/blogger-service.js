import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import config from 'config';
import { v4 as uuid } from 'uuid';
import db from '../../db/index.js';
import ApiError from '../../exceptions/api-error.js';
import fs from 'fs';

/* Сервис авторизации пользователей */
class BloggerService {
    async createContent(data, objectsFiles, logoFile) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, title, description, price } = data;

            const existsContentSales = await db.ContentSales.findOne({
                where: {
                    title: title
                }
            });

            if (existsContentSales) {
                throw ApiError.BadRequest(`Ошибка: контент с названием ${title} уже существует!`);
            }

            const contentSales = await db.ContentSales.create({
                users_id: users_id,
                title: title,
                description: description,
                price: price,
                type: "image",
                path: logoFile.path
            }, { transaction: t });

            const result = {
                ...contentSales.dataValues,
                path: `${config.get("url.api")}/${contentSales.dataValues.path}`,
                objects: []
            };

            for (let i = 0; i < objectsFiles.length; i++) {
                const objectFile = objectsFiles[i];
                const paths = objectFile.filename.split(".");
                const ext = paths[paths.length - 1];

                const object = await db.ContentObjects.create({
                    content_sales_id: contentSales.id,
                    path: objectFile.path,
                    filename: objectFile.filename,
                    ext: ext
                }, { transaction: t });

                result.objects.push({
                    ...object.dataValues,
                    path: `${config.get("url.api")}/${objectFile.path}`
                });
            }

            await t.commit();

            return result;
        } catch (e) {
            fs.unlinkSync(logoFile.path);
            for (let i = 0; i < objectsFiles.length; i++) {
                const objectFile = objectsFiles[i];
                fs.unlinkSync(objectFile.path);
            }

            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async updateContent(data, logoFile) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, content_sales_id, title, description, price } = data;

            const contentSale = await db.ContentSales.findOne({
                where: {
                    id: content_sales_id
                },
                transaction: t
            });

            contentSale.title = title;
            contentSale.description = description;
            contentSale.price = price;

            if (logoFile) {
                fs.unlinkSync(contentSale.path);
                contentSale.path = logoFile.path;
            }

            await contentSale.save();
            await t.commit();

            return contentSale;
        } catch (e) {
            console.log(e);
            if (logoFile) {
                fs.unlinkSync(logoFile.path);
            }

            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async deleteContent(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, content_sales_id } = data;

            const purchasedContents = await db.PurchasedContent.findAll({
                where: {
                    content_sales_id: content_sales_id
                }
            });

            if (purchasedContents.length > 0) {
                throw ApiError.BadRequest("Ошибка: невозможно удалить контент, который был куплен другими пользователями!");
            }

            const delPaths = [];
            const objects = await db.ContentObjects.findAll({
                where: {
                    content_sales_id: content_sales_id
                }
            });

            for (let i = 0; i < objects.length; i++) {
                const object = objects[i];
                delPaths.push(object.path);

                await db.ContentObjects.destroy({
                    where: {
                        id: object.id
                    },
                    transaction: t
                });
            }

            const content = await db.ContentSales.findOne({
                where: {
                    id: content_sales_id
                }
            });

            delPaths.push(content.path);
            await db.ContentSales.destroy({
                where: {
                    id: content.id
                },
                transaction: t
            });

            await t.commit();

            delPaths.forEach((item) => {
                fs.unlinkSync(item);
            });

            return true;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async getContent(data) {
        try {
            const { users_id } = data;

            const contents = await db.ContentSales.findAll({
                where: {
                    users_id: users_id
                },
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

            return contents;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async getAllServices(data) {
        try {
            const { blogger_id } = data;
            const usersServices = await db.UsersServices.findAll({
                where: {
                    users_id: blogger_id
                }
            });

            let services = null;

            if (!usersServices || usersServices.length === 0) {
                services = await db.Services.findAll();
            } else {
                services = await db.Services.findAll({
                    where: {
                        [db.Sequelize.Op.not]: {
                            id: usersServices.map((item) => item.services_id)
                        }
                    }
                });
            }

            return services;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async getCurrentServices(data) {
        try {
            const { blogger_id } = data;
            const services = await db.UsersServices.findAll({
                where: {
                    users_id: blogger_id
                },
                include: {
                    model: db.Services
                }
            });

            return services;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async deleteService(data) {
        const t = await db.sequelize.transaction();

        try {
            const { blogger_id, services_id } = data;

            await db.UsersServices.destroy({
                where: {
                    users_id: blogger_id,
                    services_id: services_id
                }
            }, { transaction: t })

            await t.commit();

            return true;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async addService(data) {
        const t = await db.sequelize.transaction();

        try {
            const { blogger_id, price, count_limit, time_limit, services_id } = data;
            
            const usersServices = await db.UsersServices.findOne({
                where: {
                    services_id: services_id,
                    users_id: blogger_id
                }
            });

            if(usersServices){
                throw ApiError.BadRequest(`Ошибка: услуга с идентификатором ${services_id} уже добавлена`);
            }

            const service = await db.UsersServices.create({
                time_limit: time_limit,
                count_limit: count_limit,
                price: price,
                users_id: blogger_id,
                services_id: services_id
            }, { transaction: t });

            await t.commit();

            return service;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async editService(data) {
        const t = await db.sequelize.transaction();

        try {
            const { blogger_id, price, count_limit, time_limit, services_id } = data;
            
            const usersServices = await db.UsersServices.findOne({
                where: {
                    services_id: services_id,
                    users_id: blogger_id
                },
                transaction: t
            });

            if(!usersServices){
                throw ApiError.BadRequest(`Ошибка: услуги с идентификатором ${services_id} не найдено`);
            }

            usersServices.price = price;
            usersServices.count_limit = count_limit;
            usersServices.time_limit = time_limit;

            await usersServices.save();

            await t.commit();

            return usersServices;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new BloggerService();