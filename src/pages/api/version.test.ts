import { StatusCodes } from 'http-status-codes';
import { createRequest, createResponse } from 'node-mocks-http';

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

  it('GET /api/version (200) -> Get api version', async () => {
    const req = createRequest({ method: 'GET' });
    const res = createResponse();

    await apiHandler(req, res);

    const body = res._getJSONData() as { apiVersion: string };

    expect(res._getStatusCode()).toBe(StatusCodes.OK);
    expect(body.apiVersion).toEqual(API_VERSION);
  });
});
