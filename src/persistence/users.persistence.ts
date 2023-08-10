import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import { IUsersPersistence } from "../interfaces/users-persistence.interface";
import { IDatabasePersistence, IRegisterUserPayload, IUpdate2FAOptions, IUser } from "../interfaces";

@injectable()
export class UsersPersistence implements IUsersPersistence {
  @inject(TYPES.DatabasePersistenceToken) db: IDatabasePersistence;

  async insertOne(payload: IRegisterUserPayload): Promise<boolean> {
    return await this.db.insertOne<IUser>("users", payload);
  }

  async findOneById(_id: string): Promise<IUser> {
    return await this.db.findOne<IUser>("users", { _id });
  }

  async findOneByEmail(email: string): Promise<IUser> {
    return await this.db.findOne<IUser>("users", { email });
  }

  async updatePassword(_id: string, password: string): Promise<boolean> {
    return await this.db.update<IUser>("users", { _id }, { password });
  }

  async update2FAPreferences(_id: string, twofa_options: IUpdate2FAOptions): Promise<boolean> {
    return await this.db.update<IUser>("users", { _id }, twofa_options);
  }
}
