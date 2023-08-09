export type TCollection = "users";

export interface IDatabasePersistence {
  findOne<T>(collection: TCollection, options: Partial<T>): Promise<T>;
  insertOne<T>(collection: TCollection, data: Omit<T, "_id">): Promise<boolean>;
  update<T>(collection: TCollection, options: Partial<T>, data: Partial<Omit<T, "_id">>): Promise<boolean>;
}
