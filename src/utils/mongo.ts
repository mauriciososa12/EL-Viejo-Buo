import { connect, set } from "mongoose";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";

dotenv.config();

export default class MongoConnection {
  static #instance: MongoConnection;

  constructor() {
    set("strictQuery", false);
    connect(process.env.MONGO_URI!, {
      dbName: process.env.MONGO_DB,
    });
  }

  static getInstance = () => {
    if (this.#instance) {
      console.log("Already connected to MongoDB");

      return this.#instance;
    }

    this.#instance = new MongoConnection();
    console.log("Connected to MongoDB");

    return this.#instance;
  };
}

export const MongoStoreInstance = {
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: process.env.MONGO_DB,
    ttl: 200,
  }),
  secret: process.env.SESSION_SECRET!,
  resave: true,
  saveUninitialized: true,
};
