import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import { GraphqlServer } from "./graphql.server";
import express from "express";

@injectable()
export class ExpressServer {
  private expressServer: express.Express;
  private graphqlServer: GraphqlServer;
  constructor(@inject(TYPES.GraphqlServerToken) graphqlServer: GraphqlServer) {
    this.graphqlServer = graphqlServer;
    this.expressServer = express();
  }

  async start() {
    this.graphqlServer.server = this.expressServer;
    this.graphqlServer.start();
  }
}
