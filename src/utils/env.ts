const ENVs = ['JWT_SECRET', 'HASHIDS_KEY', 'MONGODB_URI', 'MONGODB_NAME'] as const;

export const getEnv: (name: typeof ENVs[number]) => string = (name: string) => {
  const val = process.env[name];
  if (val !== undefined) {
    return val;
  }

  if (!isTest()) {
    throw new Error(`NotFound: missing environment variable ${name}`);
  }

  return '';
};

export const JWT_SECRET = getEnv('JWT_SECRET');
export const HASHIDS_KEY = getEnv('HASHIDS_KEY');
export const MONGODB_URI = getEnv('MONGODB_URI');
export const MONGODB_NAME = getEnv('MONGODB_NAME');

export const isTest: () => boolean = () => {
  return process.env.NODE_ENV === 'test';
};

export const isDev: () => boolean = () => {
  return process.env.NODE_ENV === 'development';
};

export const isProd: () => boolean = () => {
  return process.env.NODE_ENV === 'production';
};
