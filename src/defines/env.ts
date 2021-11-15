import { getEnv, isTest } from '@src/utils/env';

// Auth
export const JWT_SECRET = getEnv('JWT_SECRET');
export const HASHIDS_KEY = getEnv('HASHIDS_KEY');

// Mongo
export const MONGODB_URI = getEnv('MONGODB_URI');
export const MONGODB_NAME = isTest() ? global.__MONGO_DB_NAME__! : getEnv('MONGODB_NAME');
