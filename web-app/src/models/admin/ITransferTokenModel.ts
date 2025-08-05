export interface ITransferTokenModel {
    id:           number;
    tokens:       number;
    created_at:    Date;
    updated_at:    Date;
    sender_id:     number;
    receiver_id:   number;
    sender_info:   IUserInfoModel;
    receiver_info: IUserInfoModel;
}

export interface IUserInfoModel {
    id:        number;
    email:     string;
    created_at: Date;
    users_data: IUsersDataModel;
}

export interface IUsersDataModel {
    nickname:  string;
    tokens:    number;
    created_at: Date;
    updated_at: Date;
}