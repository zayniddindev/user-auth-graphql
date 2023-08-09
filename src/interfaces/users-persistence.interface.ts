import { IRegisterUserPayload } from "./auth-service.interface";
import { IUser } from "./user.interface";

export interface IUsersPersistence {
  insertOne(payload: IRegisterUserPayload): Promise<boolean>;

  findOneById(_id: number): Promise<IUser>;

  findOneByEmail(email: string): Promise<IUser>;

  updatePassword(_id: number, password: string): Promise<boolean>;
}
