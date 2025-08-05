export interface IChatGroupModel {
  users: IUserElement[];
  messages: IGroupMessage[];
  rooms_uuid: string;
}

export interface IGroupMessage {
  id: number;
  text: string;
  created_at: Date;
  updated_at: Date;
  rooms_id: number;
  users_id: number | null;
  user: IUserIdentity;
}

export interface IUserIdentity {
  email: string;
  users_data: UsersDatum[];
}

export interface UsersDatum {
  id: number;
  nickname: string;
  tokens: number;
  created_at: Date;
  updated_at: Date;
  users_id: number;
}

export interface IUserElement {
  user: IUsersSubElement;
}

export interface IUsersSubElement {
  id: number;
  email: string;
  users_data: IUsersData[];
}

export interface IUsersData {
  nickname: string;
  tokens: number;
}
