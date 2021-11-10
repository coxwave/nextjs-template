import { ObjectId } from 'bson';
import { OptionalId } from 'mongodb';

import { EncodeId } from '@src/types';

export type UserBson = {
  _id: ObjectId;
  name: string;
  email: string;
  profileUrl: string | null;
  password: string | null;
  connectedAccounts: OAuthAccount[];
  createdAt: OurDate;
  updatedAt: OurDate;
  deletedAt?: OurDate | null;
};

export type UserBsonFull = Omit<UserBson, 'deletedAt'>;
export type UserBsonOptionalId = OptionalId<UserBson>;
export type UserBsonProfile = Pick<UserBson, '_id' | 'email' | 'name' | 'profileUrl'>;
export type UserBsonWithoutCredentials = Omit<
  UserBson,
  'password' | 'connectedAccounts' | 'deletedAt'
>;
export type UserBsonEmailOnly = Pick<UserBson, '_id' | 'email'>;

const OAUTH_PROVIDERS = ['github', 'google'] as const;
type OAuthProvider = typeof OAUTH_PROVIDERS[number];
export interface OAuthAccount {
  provider: OAuthProvider;
  providerAccountId: number | string;
  accessToken: string;
  accessTokenExpires: OurDate | null;
  refreshToken: string;
  refreshTokenExpires: Date | null;
  createdAt: OurDate;
  updatedAt: OurDate;
}

// Client
export type User = EncodeId<UserBson>;
export type UserProfile = EncodeId<UserBsonProfile>;
export type UserWithoutCredentials = EncodeId<UserBsonWithoutCredentials>;
