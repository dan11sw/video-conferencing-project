/**
 * @typedef UserDataDto
 * @property {string} nickname - Никнейм пользователя
 * @property {number} tokens - Количество токенов
 * @property {Date} created_at - Точное время создание записи в БД
 * @property {Date} updated_at - Точное время изменения записи в БД
 */
class UserDataDto {
    nickname;
    tokens;
    created_at;
    updated_at;

    constructor(model) {
        this.nickname = model.nickname;
        this.tokens = model.tokens;
        this.created_at = model.created_at;
        this.updated_at = model.updated_at;
    }
}

export default UserDataDto;
