const TYPES = {
  DatabasePersistenceToken: Symbol.for("DatabasePersistence"),
  UsersPersistenceToken: Symbol.for("UsersPersistence"),
  AuthResolversToken: Symbol.for("AuthResolvers"),
  UserResolversToken: Symbol.for("UserResolvers"),
  ResolversToken: Symbol.for("Resolvers"),
  GraphqlServerToken: Symbol.for("GraphqlServer"),
  ExpressServerToken: Symbol.for("Server"),
};

export default TYPES;
