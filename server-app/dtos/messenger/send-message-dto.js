import { version, validate } from "uuid";

class SendMessageDto {
    rooms_uuid;
    text;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }

    uuid_validate() {
        return (validate(this.rooms_uuid) && (version(this.rooms_uuid) === 4));
    }
}

export default SendMessageDto;