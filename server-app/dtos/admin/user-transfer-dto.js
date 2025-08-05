/**
 * @typedef UserTransferDto
 * @property {number} sender_id - Идентификатор отправителя
 * @property {number} receiver_id - Идентификатор получателя
 * @property {number} tokens - Количество токенов
 */
class UserTransferDto {
    users_id;
    sender_id;
    receiver_id;
    tokens;

    constructor(model) {
        this.sender_id = model.sender_id;
        this.receiver_id = model.receiver_id;
        this.tokens = model.tokens;
        this.users_id = model.users_id;
    }
}

export default UserTransferDto;
