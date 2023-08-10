import { IUser } from "./user.interface";

export interface IChangePasswordPayload {
  new_password: string;
}

export interface IUserResolvers {
  me(_id: string): Promise<IUser>;

  changePassword(_id: string, payload: IChangePasswordPayload): Promise<boolean>;
}
