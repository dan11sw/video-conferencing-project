export interface IUserInfoModel {
    users_id:  number;
    email:    string;
    nickname: string;
    tokens:   number;
    roles:    IRoleModel[];
}

export interface IRoleModel {
    id:       number;
    title:    string;
    priority: number;
}
