import { ObjectId } from 'bson';
import moment from 'moment';
import { Db } from 'mongodb';

import {
  OAuthAccount,
  UserBson,
  UserBsonEmailOnly,
  UserBsonFull,
  UserBsonOptionalId,
  UserBsonProfile,
  UserBsonWithoutCredentials,
} from '@src/backend/model/user';
import { UserRepository } from '@src/backend/repository/user';
import {
  GithubOauthLoginParam,
  GithubOauthLoginResult,
  loginWithGithub,
} from '@src/utils/oauth/github';

export class UserService {
  userRepo: UserRepository;

  constructor(db: Db) {
    this.userRepo = new UserRepository(db);
  }

  // CREATE
  createUser(option: UserCreateOption): UserBson {
    return {
      _id: option._id || new ObjectId(),
      name: option.name,
      email: option.email,
      profileUrl: option.profileUrl || null,
      password: option.password || null,
      connectedAccounts: option.connectedAccounts || [],
      createdAt: option.createdAt ? option.createdAt : new Date(),
      updatedAt: option.updatedAt ? option.updatedAt : new Date(),
      deletedAt: option.deletedAt || null,
    };
  }

  async save(_user: UserBsonOptionalId) {
    _user._id = _user._id || new ObjectId();
    _user.updatedAt = new Date();

    return await this.userRepo.replaceOne(_user as UserBson, { upsert: true }); // TODO: Check if update returns upsertedId
  }

  // READ
  findUserById(_id: ObjectId): Promise<UserBsonFull | null>;
  findUserById(_id: ObjectId, scope: 'full'): Promise<UserBsonFull | null>;
  findUserById(_id: ObjectId, scope: 'profile'): Promise<UserBsonProfile | null>;
  findUserById(_id: ObjectId, scope: 'noCred'): Promise<UserBsonWithoutCredentials | null>;
  findUserById(_id: ObjectId, scope: 'emailOnly'): Promise<UserBsonEmailOnly | null>;
  async findUserById(_id: ObjectId, scope: string = 'full') {
    return await this.userRepo.findById(_id, scope);
  }

  findUserByEmail(email: string): Promise<UserBsonFull | null>;
  findUserByEmail(email: string, scope: 'full'): Promise<UserBsonFull | null>;
  findUserByEmail(email: string, scope: 'profile'): Promise<UserBsonProfile | null>;
  findUserByEmail(email: string, scope: 'noCred'): Promise<UserBsonWithoutCredentials | null>;
  findUserByEmail(email: string, scope: 'emailOnly'): Promise<UserBsonEmailOnly | null>;
  async findUserByEmail(email: string, scope: string = 'full') {
    return await this.userRepo.findByEmail(email, scope);
  }
}
type UserCreateOption = {
  _id?: ObjectId;
  name: string;
  email: string;
  profileUrl?: string | null;
  password?: string | null;
  connectedAccounts?: OAuthAccount[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export class GithubUserService extends UserService {
  constructor(db: Db) {
    super(db);
  }

  async loginWithGithub(param: GithubOauthLoginParam): Promise<UserBson> {
    const loginResult = await loginWithGithub(param);
    const oauthAccount = this.__createOatuhAccount(loginResult);

    const user = await this.findUserByEmail(loginResult.email);

    // Create new user
    if (!user) {
      const newUser = this.createUser({
        name: loginResult.login,
        email: loginResult.email,
        profileUrl: loginResult.avatar_url,
        password: null,
        connectedAccounts: [oauthAccount],
      });

      this.save(newUser);

      return newUser;
    }

    // Update existing user
    const idx = user.connectedAccounts.findIndex((acc) => {
      return acc.provider === 'github';
    });
    if (idx === -1) {
      user.connectedAccounts.push(oauthAccount); // NotFound
    } else {
      user.connectedAccounts[idx] = oauthAccount; // Replace
    }

    this.save(user);

    return user;
  }
  __createOatuhAccount(result: GithubOauthLoginResult): OAuthAccount {
    const now = new Date();
    return {
      provider: 'github',
      providerAccountId: result.id,
      accessToken: result.access_token,
      accessTokenExpires: moment(now).add(result.expires_in, 's').toDate(),
      refreshToken: result.refresh_token,
      refreshTokenExpires: moment(now).add(result.refresh_token_expires_in, 's').toDate(),
      createdAt: now,
      updatedAt: now,
    };
  }
}
