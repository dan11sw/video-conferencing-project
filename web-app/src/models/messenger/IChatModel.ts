/* Локальная модель */
export interface IChatModel {
    room_uuid: string;
    image: string;
    nickname: string;
    last_message: string;
    updated_at: string;
}

export interface IChats {
    chats: IChat[];
}

export interface IChat {
    room: IRoom;
    user: IUser;
}

export interface IRoom {
    id:        number;
    uuid:      string;
    is_private: boolean;
    messages:  IMessage[];
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
