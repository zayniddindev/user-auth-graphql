import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import { IResolvers } from "../interfaces/resolvers.interface";
import { IAuthResolvers, ILoginUserPayload, IRegisterUserPayload } from "../interfaces";
import { GraphQLError } from "graphql";
import { IUserResolvers } from "../interfaces/user-service.interface";

@injectable()
export class Resolvers implements IResolvers {
  @inject(TYPES.AuthResolversToken) private readonly authResolvers: IAuthResolvers;
  @inject(TYPES.UserResolversToken) private readonly userResolvers: IUserResolvers;

  async getAll() {
    return {
      Query: {
        me: async (_: any, __: any, context: { user: any }) => {
          if (!context?.user || !context?.user?._id) throw new Error("Unauthenticated");
          return this.userResolvers.me(context.user._id);
        },
      },
      Mutation: {
        login: async (_: any, params: ILoginUserPayload) => {
          try {
            return this.authResolvers.login(params);
          } catch (error) {
            if (error.message) throw new GraphQLError(error.message);
            throw error;
          }
        },
        register: async (_: any, params: IRegisterUserPayload) => {
          try {
            return this.authResolvers.register(params);
          } catch (error) {
            if (error.message) throw new GraphQLError(error.message);
            throw error;
          }
        },
      },
    };
  }
}
