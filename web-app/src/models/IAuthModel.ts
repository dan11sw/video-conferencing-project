export interface IAuthModel {
    users_id?: number;
    roles?:   IRoleModel[];
    iat?:     number;
    exp?:     number;
}

export interface IRoleModel {
    id?:       number;
    title?:    string;
    priority?: number;
}

export interface ISignUpModel {
    nickname: string;
    email: string;
    password: string;
}