/**
 * @typedef ModuleDto
 * @property {boolean} user
 * @property {boolean} blogger
 * @property {boolean} admin
 */
class ModuleDto {
    user;
    blogger;
    admin;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default ModuleDto;