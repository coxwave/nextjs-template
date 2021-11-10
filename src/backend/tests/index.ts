import bcrypt from 'bcrypt';
import cryptoRandomString from 'crypto-random-string';
import { MongoClient } from 'mongodb';

export function createMockUser() {
  const name = cryptoRandomString({ length: 10 });

  return {
    name,
    email: `${name}@gmail.com`,
    password: 'bar',
    encryptedPassword: bcrypt.hashSync('bar', 10),
    profileUrl: 'http://www.google.com',
  };
}

export async function loadTestConnection() {
  return await MongoClient.connect((global as any).__MONGO_URI__);
}

export function loadTestDb(connection: MongoClient) {
  return connection.db((global as any).__MONGO_DB_NAME__);
}
