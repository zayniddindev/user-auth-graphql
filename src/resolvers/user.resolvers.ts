import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import { IUser } from "../interfaces";
import { IUsersPersistence } from "../interfaces/users-persistence.interface";
import { IChangePasswordPayload, IUserResolvers } from "../interfaces/user-service.interface";
import { hash } from "bcryptjs";

@injectable()
export class UserResolvers implements IUserResolvers {
  @inject(TYPES.UsersPersistenceToken) usersDb: IUsersPersistence;

  async me(_id: number): Promise<IUser> {
    console.log(await this.usersDb.findOneById(_id));

    return await this.usersDb.findOneById(_id);
  }

  async changePassword(id: number, payload: IChangePasswordPayload): Promise<boolean> {
    return await this.usersDb.updatePassword(id, await hash(payload.new_password, 10));
  }
}
