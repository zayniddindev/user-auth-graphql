import { injectable } from "inversify";
import { Db, MongoClient } from "mongodb";
import { env } from "../config";
import { IDatabasePersistence, TCollection } from "../interfaces";

@injectable()
export class DatabasePersistence implements IDatabasePersistence {
  private db: Db;

  constructor() {
    const client = new MongoClient(env.DB_URL);
    this.db = client.db(env.DB_NAME);
  }

  async findOne<T>(collection: TCollection, options: Partial<T>) {
    return (await this.db.collection(collection).findOne(options)) as T;
  }

  async insertOne<T>(collection: TCollection, data: Omit<T, "_id">) {
    return (await this.db.collection(collection).insertOne(data)).acknowledged;
  }

  async update<T>(collection: "users", options: Partial<T>, data: Omit<T, "_id">) {
    return (await this.db.collection(collection).updateOne(options, data)).modifiedCount == 1;
  }
}
