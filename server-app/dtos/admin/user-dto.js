import UserDataDto from "./user-data-dto.js";

/**
 * @typedef UserDto
 * @property {string} access_token - Токен доступа
 */
class UserDto {
    id;
    email;
    created_at;
    users_data;

    constructor(model) {
        this.id = model.id;
        this.email = model.email;
        this.created_at = model.created_at;
        this.users_data = new UserDataDto(model.users_data[0]);
    }
}

export default UserDto;
