import ApiError from '../exceptions/api-error.js';
import db from '../db/index.js';

/**
 * Middleware для фильтрации пользователей, которые не имеют определённых ролей
 * @param {*} titles Названия ролей, которые необходимы для разрешения доступа
 * @returns 
 */
const accessMiddleware = (titles) => {
    return async function (req, res, next) {
        try {
            const users_id = req.body.users_id;
            let access = false;

            for(let i = 0; i < titles.length; i++) {
                const title = titles[i];
                const role = await db.Roles.findOne({
                    where: {
                        title: title
                    }
                });
    
                const usersRoles = await db.UsersRoles.findOne({
                    where: {
                        users_id: users_id,
                        roles_id: role.id
                    }
                });

                if(usersRoles){
                    access = true;
                    break;
                }
            }

            if(!access){
                return next(ApiError.Forbidden());
            }

            next();
        } catch (e) {
            return next(ApiError.UnathorizedError());
        }
    };
}

export default accessMiddleware;
