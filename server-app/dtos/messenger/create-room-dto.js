
class CreateRoomDto {
    users_list;
    is_private;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
    s
    validate() {
        return ((this.users_list !== null && typeof (this.users_list) === typeof (new Array()))
            && (this.is_private !== null));
    }
}

export default CreateRoomDto;