export interface IServiceModel {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  users_id: number | null;
}

export interface ICurrentServiceModel {
  id: number;
  price: number;
  time_limit: number | null;
  count_limit: number | null;
  created_at: string;
  updated_at: string;
  users_id: number;
  services_id: number;
  service: IServiceModel;
}
