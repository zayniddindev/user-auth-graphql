import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import { IUsersPersistence } from "../interfaces/users-persistence.interface";
import { IDatabasePersistence, IRegisterUserPayload, IUser } from "../interfaces";

@injectable()
export class UsersPersistence implements IUsersPersistence {
  @inject(TYPES.DatabasePersistenceToken) db: IDatabasePersistence;

  async insertOne(payload: IRegisterUserPayload): Promise<boolean> {
    return await this.db.insertOne<IUser>("users", payload);
  }

  async findOneById(_id: number): Promise<IUser> {
    return await this.db.findOne<IUser>("users", { _id });
  }

  async findOneByEmail(email: string): Promise<IUser> {
    return await this.db.findOne<IUser>("users", { email });
  }

  async updatePassword(_id: number, password: string): Promise<boolean> {
    return await this.db.update<IUser>("users", { _id }, { password });
  }
}
