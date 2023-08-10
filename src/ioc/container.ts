require("reflect-metadata");
import { Container } from "inversify";
import TYPES from "./types";
import { AuthResolvers } from "../resolvers/auth.resolver";
import { GraphqlServer, ExpressServer } from "../servers";
import { Resolvers } from "../resolvers";
import { DatabasePersistence, UsersPersistence } from "../persistence";
import { UserResolvers } from "../resolvers/user.resolvers";

export const container = new Container();

container.bind<DatabasePersistence>(TYPES.DatabasePersistenceToken).to(DatabasePersistence);
container.bind<UsersPersistence>(TYPES.UsersPersistenceToken).to(UsersPersistence);
container.bind<AuthResolvers>(TYPES.AuthResolversToken).to(AuthResolvers);
container.bind<UserResolvers>(TYPES.UserResolversToken).to(UserResolvers);
container.bind<Resolvers>(TYPES.ResolversToken).to(Resolvers);
container.bind<GraphqlServer>(TYPES.GraphqlServerToken).to(GraphqlServer);
container.bind<ExpressServer>(TYPES.ExpressServerToken).to(ExpressServer);

export default container;
