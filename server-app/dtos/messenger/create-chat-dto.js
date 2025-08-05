
class CreateChatDto {
    nickname;
    text;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default CreateChatDto;