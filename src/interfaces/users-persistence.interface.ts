import { IRegisterUserPayload, IUpdate2FAOptions } from "./auth-service.interface";
import { IUser } from "./user.interface";

export interface IUsersPersistence {
  insertOne(payload: IRegisterUserPayload): Promise<boolean>;

  findOneById(_id: string): Promise<IUser>;

  findOneByEmail(email: string): Promise<IUser>;

  updatePassword(_id: string, password: string): Promise<boolean>;

  update2FAPreferences(_id: string, twofa_options: IUpdate2FAOptions): Promise<boolean>;
}
