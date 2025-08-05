/**
 * @typedef UserIdDto
 * @property {number} users_id
 */
class UserIdDto {
    users_id;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default UserIdDto;