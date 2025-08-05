/**
 * @typedef LogoutDto
 * @property {string} access_token.required
 * @property {string} refresh_token.required
 */
class LogoutDto {
    access_token;
    refresh_token;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default LogoutDto;