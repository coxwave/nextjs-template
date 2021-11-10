import { ObjectId } from 'bson';
import { Collection, Db, InsertOneOptions, ReplaceOptions, UpdateOptions } from 'mongodb';

import { UserBson, UserBsonOptionalId } from '@src/backend/model/user';

import { Scope } from '.';

export class UserRepository {
  db: Db;
  collection: Collection<UserBson>;

  constructor(db: Db) {
    this.db = db;
    this.collection = db.collection<UserBson>('user');
  }

  async findById(_id: ObjectId, scope: string = 'full') {
    return await this.collection.findOne(
      { _id },
      {
        projection: UserScopes[scope],
      },
    );
  }

  async findByEmail(email: string, scope: string = 'full') {
    return await this.collection.findOne(
      { email },
      {
        projection: UserScopes[scope],
      },
    );
  }

  async insertOne(user: UserBsonOptionalId, options?: InsertOneOptions) {
    if (options) {
      return await this.collection.insertOne(user, options);
    }
    return await this.collection.insertOne(user);
  }

  async replaceOne(user: UserBson, options?: ReplaceOptions) {
    const query = { _id: user._id };
    if (options) {
      return await this.collection.replaceOne(query, user, options);
    }

    return this.collection.replaceOne(query, user);
  }

  async updateOne(user: UserBson, options?: UpdateOptions) {
    const query = { _id: user._id };
    const update = { $set: user };
    if (options) {
      return await this.collection.updateOne(query, update, options);
    }
    return await this.collection.updateOne(query, update);
  }

  // async updateConnectedAccounts(
  //   user: Pick<UserBson, '_id' | 'connectedAccounts'>,
  //   oauthAccount: OAuthAccount,
  // ) {
  //   const provider = oauthAccount.provider;

  //   const alreadyConnected = user.connectedAccounts
  //     .map(({ provider }) => provider)
  //     .includes('github');

  //   const queryFilter: Filter<UserBson> = alreadyConnected
  //     ? { _id: user._id, connectedAccounts: { provider } }
  //     : { _id: user._id };

  //   const updateFilter: UpdateFilter<UserBson> = alreadyConnected
  //     ? {
  //         $set: {
  //           'connectedAccounts.$.accessToken': oauthAccount.accessToken,
  //           'connectedAccounts.$.accessTokenExpires': new Date(
  //             Date.now() + String(oauthAccount.accessTokenExpires),
  //           ),
  //           'connectedAccounts.$.refreshToken': oauthAccount.refreshToken,
  //           'connectedAccounts.$.refreshTokenExpires': new Date(
  //             Date.now() + String(oauthAccount.refreshTokenExpires),
  //           ),
  //           'connectedAccounts.$.updatedAt': new Date(),
  //         },
  //       }
  //     : {
  //         $push: {
  //           connectedAccounts: oauthAccount,
  //         },
  //       };
  //   return await this.collection.updateOne(queryFilter, updateFilter);
  // }
}

export const UserScopes: Scope<UserBson> = {
  full: { deletedAt: 0 },
  profile: {
    email: 1,
    name: 1,
    profileUrl: 1,
  },
  noCred: {
    password: 0,
    connectedAccounts: 0,
    deletedAt: 0,
  },
  emailOnly: {
    _id: 0,
    email: 1,
  },
};
