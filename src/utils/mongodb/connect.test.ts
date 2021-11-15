import { v4 } from 'uuid';

import { MONGODB_NAME } from '@src/defines/env';

import { connectMongo, MongoDB } from './connect';

describe('mongodb connection', () => {
  let db: MongoDB;

  beforeAll(async () => {
    db = await connectMongo();
  });

  afterAll(async () => {
    await db.client.close();
  });

  it('Check db_name', async () => {
    expect(db.client.options.dbName).toBe(MONGODB_NAME);
    expect(db.inner.databaseName).toBe(MONGODB_NAME);
  });

  it('Create and drop collection', async () => {
    const collectionName = v4();

    const result = await db.inner.createCollection(collectionName);
    expect(result.collectionName).toBe(collectionName);

    const success = await db.inner.dropCollection(collectionName);
    expect(success).toBe(true);

    const collections = await db.inner.listCollections().toArray();
    expect(collections.findIndex((collection) => collection.name === collectionName)).toBe(-1);
  });
});
