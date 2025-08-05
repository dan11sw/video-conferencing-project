import { version, validate } from "uuid";

class TransferTokenDto {
    rooms_uuid;
    tokens;

    constructor(model) {
        this.rooms_uuid = model.rooms_uuid;
        this.tokens = model.tokens;
    }

    uuid_validate() {
        return (validate(this.rooms_uuid) && (version(this.rooms_uuid) === 4));
    }
}

export default TransferTokenDto;