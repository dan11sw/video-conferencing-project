/**
 * @typedef RefreshDto
 * @property {string} refresh_token.required
 */
class RefreshDto {
    refresh_token;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default RefreshDto;