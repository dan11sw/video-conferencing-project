import { version, validate } from "uuid";

class RequestServiceDto {
    rooms_uuid;
    services_id;

    constructor(model) {
        this.rooms_uuid = model.rooms_uuid;
        this.services_id = model.services_id;
    }

    uuid_validate() {
        return (validate(this.rooms_uuid) && (version(this.rooms_uuid) === 4));
    }
}

export default RequestServiceDto;