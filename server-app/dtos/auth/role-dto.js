/**
 * @typedef RoleDto
 * @property {number} id.required
 * @property {string} title.required
 * @property {string} priority.required
 */
class RoleDto {
    id;
    title;
    priority;

    constructor(model) {
        this.id = model.id;
        this.title = model.title;
        this.priority = model.priority;
    }
}

export default RoleDto;