
/**
 * @typedef AuthDto
 * @property {string} access_token - Токен доступа
 */
class AuthDto {
    access_token;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default AuthDto;
