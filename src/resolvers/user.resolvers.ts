import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import { IUser } from "../interfaces";
import { IUsersPersistence } from "../interfaces/users-persistence.interface";
import { IChangePasswordPayload, IUserResolvers } from "../interfaces/user-service.interface";
import { hash } from "bcryptjs";
import { UserNotFoundException } from "../exceptions/user-not-found.exception";

@injectable()
export class UserResolvers implements IUserResolvers {
  @inject(TYPES.UsersPersistenceToken) usersDb: IUsersPersistence;

  async me(_id: string): Promise<IUser> {
    return await this.usersDb.findOneById(_id);
  }

  async changePassword(_id: string, payload: IChangePasswordPayload): Promise<boolean> {
    const user = await this.usersDb.findOneById(_id);
    if (!user) throw new UserNotFoundException();
    return await this.usersDb.updatePassword(_id, await hash(payload.new_password, 10));
  }
}
