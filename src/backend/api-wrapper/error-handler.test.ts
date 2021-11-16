import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { createRequest, createResponse } from 'node-mocks-http';

import { ApiError, ApiErrorJson } from '@src/defines/errors';

import { NextApiBuilder } from '.';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import type { MockRequest, MockResponse } from 'node-mocks-http';

const mockHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    switch (req.query.error) {
      case 'alreadySent':
        res.status(StatusCodes.NO_CONTENT).end();
        throw new Error('Should never see me!');
      case 'unexpectedError':
        throw new Error('Unexpected Error');
      case 'throwWithStatusCode':
        res.status(StatusCodes.NOT_ACCEPTABLE);
        throw new Error('Not Acceptable Error');
      case 'apiError':
        throw new ApiError('TOKEN_EXPIRED');
      case 'validationError':
        await Joi.string().valid('shouldBeDifferent').validateAsync(req.query.error);
    }

    res.status(StatusCodes.OK).json({ hello: 'world' });
  }
};

describe('Default wrapper (error-handler)', () => {
  let apiHandler: NextApiHandler;

  let req: MockRequest<NextApiRequest>;
  let res: MockResponse<NextApiResponse>;

  beforeAll(() => {
    apiHandler = new NextApiBuilder(mockHandler).build();
  });

  it('should success', async () => {
    req = createRequest({ method: 'GET' });
    res = createResponse();

    await apiHandler(req, res);

    const body = res._getJSONData() as { hello: string };

    expect(res._getStatusCode()).toBe(StatusCodes.OK);
    expect(body.hello).toEqual('world');
  });

  it('should success if handler throws after sending a response', async () => {
    req = createRequest({ method: 'GET', query: { error: 'alreadySent' } });
    res = createResponse();

    await apiHandler(req, res);

    expect(res._getStatusCode()).toBe(StatusCodes.NO_CONTENT);
    expect(async () => await apiHandler(req, res)).not.toThrowError();
  });

  it('should fail - method not allowed', async () => {
    req = createRequest({ method: 'POST' });
    res = createResponse();

    await apiHandler(req, res);

    expect(res._getStatusCode()).toBe(StatusCodes.METHOD_NOT_ALLOWED);
  });

  it('should fail - unexpected error', async () => {
    req = createRequest({ method: 'GET', query: { error: 'unexpectedError' } });
    res = createResponse();

    await apiHandler(req, res);

    const body = res._getJSONData() as ApiErrorJson;

    expect(res._getStatusCode()).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(body.code).toStrictEqual(new ApiError('INTERNAL_SERVER_ERROR').toJson().code);
  });

  it('should fail - throw error with statusCode', async () => {
    req = createRequest({ method: 'GET', query: { error: 'throwWithStatusCode' } });
    res = createResponse();

    await apiHandler(req, res);

    const body = res._getJSONData() as ApiErrorJson;

    expect(res._getStatusCode()).toBe(StatusCodes.NOT_ACCEPTABLE);
    expect(body.code).toStrictEqual(new ApiError('INTERNAL_SERVER_ERROR').toJson().code);
  });

  it('should fail - validation error', async () => {
    req = createRequest({ method: 'GET', query: { error: 'validationError' } });
    res = createResponse();

    await apiHandler(req, res);

    const body = res._getJSONData() as ApiErrorJson;

    expect(res._getStatusCode()).toBe(StatusCodes.BAD_REQUEST);
    expect(body.code).toStrictEqual(new ApiError('VALIDATION_ERROR').toJson().code);
  });

  it('should fail - api error', async () => {
    req = createRequest({ method: 'GET', query: { error: 'apiError' } });
    res = createResponse();

    await apiHandler(req, res);

    const body = res._getJSONData() as ApiErrorJson;

    expect(res._getStatusCode()).toBe(StatusCodes.UNAUTHORIZED);
    expect(body.code).toStrictEqual(new ApiError('TOKEN_EXPIRED').toJson().code);
  });
});
