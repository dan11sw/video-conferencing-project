/**
 * @typedef TokenDto
 * @property {string} access_token
 * @property {string} refresh_token
 */
class TokenDto {
    access_token;
    refresh_token;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default TokenDto;