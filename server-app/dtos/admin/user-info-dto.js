/**
 * @typedef UserInfoDto
 * @property {string} access_token - Токен доступа
 */
class UserInfoDto {
    users_id;
    email;
    nickname;
    tokens;
    roles;

    constructor(model) {
        this.users_id = model.users_id;
        this.email = model.email;
        this.nickname = model.nickname;
        this.tokens = model.tokens;
        this.roles = model.roles;
    }
}

export default UserInfoDto;
