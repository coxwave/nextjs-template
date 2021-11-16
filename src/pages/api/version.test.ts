import { StatusCodes } from 'http-status-codes';

import TH from '@src/backend/test-helper';
import { connectMongo } from '@src/utils/mongodb/connect';
import type { MongoDB } from '@src/utils/mongodb/connect';

import apiHandler, { API_VERSION } from './version';

describe('/api/version', () => {
  let mongo: MongoDB;

  beforeAll(async () => {
    mongo = await connectMongo();
  });

  afterAll(async () => {
    await mongo.client.close();
  });

  it('GET /api/version -> Get api version', async () => {
    const { statusCode, jsonData } = await TH.testApiHandler<{ apiVersion: string }>(apiHandler, {
      method: 'GET',
    });

    expect(statusCode).toBe(StatusCodes.OK);
    expect(jsonData?.apiVersion).toEqual(API_VERSION);
  });

  it('POST /api/version -> method not allowed', async () => {
    const { statusCode } = await TH.testApiHandler(apiHandler, { method: 'POST' });

    expect(statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED);
  });
});
