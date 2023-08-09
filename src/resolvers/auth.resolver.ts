import { inject, injectable } from "inversify";
import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import TYPES from "../ioc/types";
import {
  IAuthResolvers,
  IAuthTokens,
  IAuthanticatedUser,
  ILoginUserPayload,
  IRegisterUserPayload,
} from "../interfaces";
import { IUsersPersistence } from "../interfaces/users-persistence.interface";
import { env } from "../config";

@injectable()
export class AuthResolvers implements IAuthResolvers {
  @inject(TYPES.UsersPersistenceToken) usersDb: IUsersPersistence;

  async register(payload: IRegisterUserPayload) {
    const { name, email, password } = payload;
    const already_exists = await this.usersDb.findOneByEmail(email);
    if (already_exists) throw new Error("User already exists");
    const hashed_password = await hash(password, 10);
    const user_inserted = await this.usersDb.insertOne({ name, email, password: hashed_password });
    return user_inserted ? "User successfully created" : "Error during registering";
  }

  async login(payload: ILoginUserPayload): Promise<IAuthTokens> {
    const user = await this.usersDb.findOneByEmail(payload.email);
    if (!user) throw new Error("User not found");

    const password_match = await compare(payload.password, user.password);
    if (!password_match) throw new Error("Wrong password");

    const access_token = this.generateToken(user._id);
    return { access_token };
  }

  async vaidateToken(token: string): Promise<IAuthanticatedUser> {
    try {
      return verify(token, env.JWT_SECRET) as IAuthanticatedUser;
    } catch (error) {
      return {};
    }
  }

  private generateToken(_id: number) {
    return sign({ _id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  }
}
