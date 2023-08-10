import { Express } from "express";
import { Server, createServer } from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "../schema";
import { Resolvers } from "../resolvers";
import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import { AuthResolvers } from "../resolvers/auth.resolver";

@injectable()
export class GraphqlServer {
  private app: Express;
  private httpServer: Server;
  @inject(TYPES.ResolversToken) resolvers: Resolvers;
  @inject(TYPES.AuthResolversToken) authResolver: AuthResolvers;

  set server(app: Express) {
    this.app = app;
    this.httpServer = createServer(this.app);
  }

  async start() {
    const server = new ApolloServer({
      typeDefs,
      resolvers: await this.resolvers.getAll(),
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer })],
    });

    const { url } = await startStandaloneServer(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || "";
        const user = await this.authResolver.vaidateJWTToken(token);
        return { user };
      },
    });
    console.log(`🚀 Server ready at ${url}`);
  }
}
