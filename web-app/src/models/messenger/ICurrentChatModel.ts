export interface ICurrentChatModel {
    user:     IUser;
    messages: IMessage[];
    rooms_uuid: string;
}

export interface IMessage {
    id:        number;
    text:      string;
    created_at: Date;
    updated_at: Date;
    rooms_id:   number;
    users_id:   number;
}

export interface IUser {
    id:        number;
    email:     string;
    users_data: IUsersData[];
}

export interface IUsersData {
    nickname: string;
    tokens:   number;
}
