import { ObjectId } from 'bson';
import { MongoClient } from 'mongodb';

import { UserRepository } from '@src/backend/repository/user';
import { loadTestConnection, loadTestDb } from '@src/backend/tests';

const has = Object.prototype.hasOwnProperty; // cache the lookup once, in module scope.

describe('test UserRepository', () => {
  let connection: MongoClient;
  let repository: UserRepository;
  let _id: ObjectId;

  beforeAll(async () => {
    connection = await loadTestConnection();
    const db = loadTestDb(connection);
    repository = new UserRepository(db);
  });

  beforeEach(async () => {
    const { insertedId } = await repository.collection.insertOne({
      name: 'foo',
      email: 'foo@gmail.com',
      password: null,
      profileUrl: 'www.foo.com',
      connectedAccounts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    _id = insertedId;
  });

  afterEach(async () => {
    await repository.collection.deleteOne({ _id });
  });

  test('findByEmail()', async () => {
    const user = await repository.findByEmail('foo@gmail.com');

    expect(user === null).toStrictEqual(false);
    expect(user?.email === 'foo@gmail.com');
    expect(has.call(user, 'password')).toStrictEqual(true);
  });

  test('findByEmail(scope="full")', async () => {
    const user = await repository.findByEmail('foo@gmail.com', 'full');

    expect(user === null).toStrictEqual(false);
    expect(user?.email === 'foo@gmail.com');
    expect(has.call(user, 'password')).toStrictEqual(true);
  });

  test('findByEmail(scope="profile")', async () => {
    const user = await repository.findByEmail('foo@gmail.com', 'profile');

    expect(user === null).toStrictEqual(false);
    expect(user?.email === 'foo@gmail.com');
    expect(has.call(user, 'password')).toStrictEqual(false);
  });

  test('findByEmail(scope="noCred")', async () => {
    const user = await repository.findByEmail('foo@gmail.com', 'noCred');

    expect(user === null).toStrictEqual(false);
    expect(user?.email === 'foo@gmail.com');
    expect(has.call(user, 'password')).toStrictEqual(false);
  });
});
