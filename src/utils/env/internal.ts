import { getEnv } from '.';

export const JWT_SECRET = getEnv('JWT_SECRET');
export const HASHIDS_KEY = getEnv('HASHIDS_KEY');
export const MONGODB_URI = getEnv('MONGODB_URI');
export const MONGODB_NAME = getEnv('MONGODB_NAME');
