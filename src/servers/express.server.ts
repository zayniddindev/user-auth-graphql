import { inject, injectable } from "inversify";
import TYPES from "../ioc/types";
import { GraphqlServer } from "./graphql.server";
import express from "express";
import { DatabasePersistence } from "../persistence";

@injectable()
export class ExpressServer {
  private expressServer: express.Express;
  constructor(
    @inject(TYPES.GraphqlServerToken) private readonly graphqlServer: GraphqlServer,
    @inject(TYPES.DatabasePersistenceToken) private readonly database: DatabasePersistence
  ) {
    this.expressServer = express();
  }

  async start() {
    this.graphqlServer.server = this.expressServer;
    await this.database.connect();
    await this.graphqlServer.start();
  }
}
