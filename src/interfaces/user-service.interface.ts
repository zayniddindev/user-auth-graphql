import { IUser } from "./user.interface";

export interface IChangePasswordPayload {
  new_password: string;
}

export interface IUserResolvers {
  me(_id: number): Promise<IUser>;

  changePassword(_id: number, payload: IChangePasswordPayload): Promise<boolean>;
}
