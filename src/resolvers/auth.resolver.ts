import { inject, injectable } from "inversify";
import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { toFileStream } from "qrcode";
import TYPES from "../ioc/types";
import {
  IAuthResolvers,
  IAuthTokens,
  IAuthanticatedUser,
  ILoginUserPayload,
  ILoginUserWith2FAPayload,
  IRegisterUserPayload,
} from "../interfaces";
import { IUsersPersistence } from "../interfaces/users-persistence.interface";
import { env } from "../config";
import { createWriteStream } from "fs";
import { authenticator } from "otplib";
import { UserAlreadyExistsException } from "../exceptions/user-already-exists.exception";
import { UserNotFoundException } from "../exceptions/user-not-found.exception";
import { WrongPasswordException } from "../exceptions/wrong-password.exception";
import { WrongOtpxception } from "../exceptions/wrong-otp.exception";

@injectable()
export class AuthResolvers implements IAuthResolvers {
  @inject(TYPES.UsersPersistenceToken) usersDb: IUsersPersistence;

  async register(payload: IRegisterUserPayload) {
    const { name, email, password } = payload;
    const already_exists = await this.usersDb.findOneByEmail(email);
    if (already_exists) throw new UserAlreadyExistsException();
    const hashed_password = await hash(password, 10);
    const user_inserted = await this.usersDb.insertOne({ name, email, password: hashed_password });
    return user_inserted ? "User successfully created" : "Error during registering";
  }

  async login(payload: ILoginUserPayload): Promise<IAuthTokens> {
    const user = await this.usersDb.findOneByEmail(payload.email);
    if (!user) throw new UserNotFoundException();

    const password_match = await compare(payload.password, user.password);
    if (!password_match) throw new WrongPasswordException();

    const access_token = this.generateToken(user._id);
    return { access_token };
  }

  async generateQRCode(_id: string): Promise<string> {
    const path = `public/${_id}.jpg`;
    const qrcode_stream = createWriteStream(path, { encoding: "base64" });

    const secret = authenticator.generateSecret();
    const otp = authenticator.keyuri(_id, env.TWOFA_APP_NAME, secret);
    toFileStream(qrcode_stream, otp);

    await this.usersDb.update2FAPreferences(_id, { twofa_code: secret });

    return path;
  }

  async enable2fa(_id: string, twofa_code: string): Promise<boolean> {
    const user = await this.usersDb.findOneById(_id);

    const twofa_verified = authenticator.verify({
      secret: user.twofa_code,
      token: twofa_code,
    });
    if (!twofa_verified) throw new WrongOtpxception();

    return await this.usersDb.update2FAPreferences(_id, { twofa_enabled: true });
  }

  async loginWith2fa(payload: ILoginUserWith2FAPayload) {
    const user = await this.usersDb.findOneByEmail(payload.email);

    const password_match = await compare(payload.password, user.password);
    if (!password_match) throw new WrongPasswordException();

    const twofa_verified = authenticator.verify({
      secret: user.twofa_code,
      token: payload.otp,
    });
    if (!twofa_verified) throw new WrongOtpxception();

    const access_token = this.generateToken(user._id);
    return { access_token };
  }

  async vaidateJWTToken(token: string): Promise<IAuthanticatedUser> {
    try {
      return verify(token, env.JWT_SECRET) as IAuthanticatedUser;
    } catch (error) {
      return {};
    }
  }

  private generateToken(_id: string) {
    return sign({ _id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  }
}
