import { MONGODB_NAME } from '@src/defines/env';

import clientPromise from '.';

import type { Db, MongoClient } from 'mongodb';

export async function connectMongo(): Promise<MongoDB> {
  const client = await clientPromise;
  const db = client.db(MONGODB_NAME);

  return new MongoDB(client, db);
}

export class MongoDB {
  client: MongoClient;
  inner: Db;

  constructor(client: MongoClient, inner: Db) {
    this.client = client;
    this.inner = inner;
  }

  getClient(): MongoClient {
    return this.client;
  }

  getDB(): Db {
    return this.inner;
  }
}
