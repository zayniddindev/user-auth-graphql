import { injectable } from "inversify";
import { Db, MongoClient, ObjectId } from "mongodb";
import { env } from "../config";
import { IDatabasePersistence, TCollection } from "../interfaces";

@injectable()
export class DatabasePersistence implements IDatabasePersistence {
  private db_client: MongoClient;
  private db: Db;

  constructor() {
    this.db_client = new MongoClient(env.DB_URL);
    this.db = this.db_client.db(env.DB_NAME);
  }

  async connect() {
    await this.db_client.connect();
  }

  async findOne<T>(collection: TCollection, options: Partial<any>) {
    if (options._id) options._id = new ObjectId(options._id);
    return (await this.db.collection(collection).findOne(options)) as T;
  }

  async insertOne<T>(collection: TCollection, data: Omit<T, "_id">) {
    return (await this.db.collection(collection).insertOne(data)).acknowledged;
  }

  async update<T>(collection: "users", options: Partial<any>, data: Omit<T, "_id">) {
    if (options._id) options._id = new ObjectId(options._id);
    return (await this.db.collection(collection).updateOne(options, { $set: data })).modifiedCount == 1;
  }
}
