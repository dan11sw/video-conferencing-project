/**
 * @typedef UserIdDto
 * @property {string} user_id - Идентификатор пользователя
 */
class UserIdDto {
    user_id;

    constructor(model) {
        this.user_id = model.user_id;
    }
}

export default UserIdDto;
