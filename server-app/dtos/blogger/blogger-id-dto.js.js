/**
 * @typedef BloggerIdDto
 * @property {string} blogger_id - Идентификатор блогера
 */
class BloggerIdDto {
    blogger_id;

    constructor(model) {
        this.blogger_id = model.blogger_id;
    }
}

export default BloggerIdDto;
