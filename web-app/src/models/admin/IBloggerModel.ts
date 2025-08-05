import { ITransferTokenModel } from "./ITransferTokenModel";

export interface IUserModel {
  user: IUser;
  transfers: ITransferTokenModel[];
  roles: IRole[];
}

export interface IRole {
  id: number;
  title: string;
  priority: number;
  users_roles: IUsersRoles[];
}

export interface IUsersRoles {
  id: number;
  created_at: string;
  updated_at: string;
  users_id: number;
  roles_id: number;
}

export interface IUser {
  id: number;
  email: string;
  created_at: Date;
  users_data: IUsersData[];
}

export interface IUsersData {
  tokens: number;
  nickname: string;
}
