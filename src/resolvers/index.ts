import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import { IResolvers } from "../interfaces/resolvers.interface";
import { IAuthResolvers, ILoginUserPayload, IRegisterUserPayload } from "../interfaces";
import { IUserResolvers } from "../interfaces/user-service.interface";
import { UserUnauthenticatedException } from "../exceptions/user-unauthenticated.exception";

@injectable()
export class Resolvers implements IResolvers {
  @inject(TYPES.AuthResolversToken) private readonly authResolvers: IAuthResolvers;
  @inject(TYPES.UserResolversToken) private readonly userResolvers: IUserResolvers;

  async getAll() {
    return {
      Query: {
        me: async (_: any, __: any, context: { user: any }) => {
          if (!context?.user || !context?.user?._id) throw new UserUnauthenticatedException();
          return this.userResolvers.me(context.user._id);
        },
      },
      Mutation: {
        login: async (_: any, params: ILoginUserPayload) => {
          return this.authResolvers.login(params);
        },
        register: async (_: any, params: IRegisterUserPayload) => {
          return this.authResolvers.register(params);
        },
        changePassword: async (_: any, params: { new_password: string }, context: { user: any }) => {
          if (!context?.user || !context?.user?._id) throw new UserUnauthenticatedException();
          return this.userResolvers.changePassword(context.user._id, { new_password: params.new_password });
        },
        generateQRCode: async (_: any, __: any, context: { user: any }) => {
          if (!context?.user || !context?.user?._id) throw new UserUnauthenticatedException();
          return await this.authResolvers.generateQRCode(context.user._id);
        },
        enable2fa: async (_: any, params: { twofa_code: string }, context: { user: any }) => {
          if (!context?.user || !context?.user?._id) throw new UserUnauthenticatedException();
          return await this.authResolvers.enable2fa(context.user._id, params.twofa_code);
        },
        loginWith2fa: (
          _: any,
          params: {
            email: string;
            password: string;
            otp: string;
          }
        ) => {
          return this.authResolvers.loginWith2fa(params);
        },
      },
    };
  }
}
