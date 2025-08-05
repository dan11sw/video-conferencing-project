import ApiError from '../exceptions/api-error.js';

/**
 * Middleware для конвертации типов
 * @param {*} req Запрос от пользователя 
 * @param {*} res Ответ пользователю
 * @param {*} next 
 * @returns 
 */
const converterTypeMiddleware = function(field, type) {

    return async function (req, res, next) {
        try {
            switch(type){
                case "number": {
                    req.body[field] = Number(req.body[field]);
                    break;
                }
                case "string": {
                    req.body[field] = String(req.body[field]);
                    break;
                }
            }
            
            next();
        } catch (e) {
            return next(ApiError.InternalServerError());
        }
    };
};

export default converterTypeMiddleware;
