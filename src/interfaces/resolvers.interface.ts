export interface IResolvers {
  getAll(): Promise<{
    Query: {
      [key: string]: any;
    };
    Mutation: {
      [key: string]: any;
    };
  }>;
}
