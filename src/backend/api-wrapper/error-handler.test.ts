import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import TH from '@backend/test-helper';

import { ApiError, type ApiErrorJson } from '@utils/api-error';

import { NextApiBuilder } from '.';

import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const mockHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    switch (req.query.error) {
      case 'alreadySent':
        res.status(StatusCodes.NO_CONTENT).end();
        throw new Error('Should never see me!');

      case 'unexpectedError':
        throw new Error('Unexpected Error');

      case 'unexpectedWeirdError':
        throw 'can I be thrown?';

      case 'throwWithStatusCode':
        res.status(StatusCodes.NOT_ACCEPTABLE);
        throw new Error('Not Acceptable Error');

      case 'apiError':
        throw new ApiError('TOKEN_EXPIRED');

      case 'validationError':
        await z.literal('shouldBeDifferent').parseAsync(req.query.error);
    }

    res.status(StatusCodes.OK).json({ hello: 'world' });
  }
};

describe('Default wrapper (error-handler)', () => {
  let apiHandler: NextApiHandler;

  beforeAll(() => {
    apiHandler = new NextApiBuilder(mockHandler).build();
  });

  it('should success', async () => {
    const { statusCode, jsonData } = await TH.testApiHandler<{ hello: string }>(apiHandler, {
      req: { method: 'GET' },
    });

    expect(statusCode).toBe(StatusCodes.OK);
    expect(jsonData?.hello).toEqual('world');
  });

  it('should success if handler throws after sending a response', async () => {
    const { statusCode } = await TH.testApiHandler(apiHandler, {
      method: 'GET',
      query: { error: 'alreadySent' },
    });

    expect(statusCode).toBe(StatusCodes.NO_CONTENT);
  });

  it('should fail - method not allowed', async () => {
    const { statusCode } = await TH.testApiHandler(apiHandler, { method: 'POST' });

    expect(statusCode).toBe(StatusCodes.METHOD_NOT_ALLOWED);
  });

  it('should fail - unexpected error', async () => {
    const { statusCode, jsonData } = await TH.testApiHandler<ApiErrorJson>(apiHandler, {
      method: 'GET',
      query: { error: 'unexpectedError' },
    });

    expect(statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(jsonData).toHaveProperty('stack');
    expect(jsonData?.stack).toBeDefined();
  });

  it('should fail - unexpected weird error', async () => {
    const { statusCode, jsonData } = await TH.testApiHandler<ApiErrorJson>(apiHandler, {
      method: 'GET',
      query: { error: 'unexpectedWeirdError' },
    });

    expect(statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(jsonData).not.toHaveProperty('stack');
  });

  it('should fail - throw error with statusCode', async () => {
    const { statusCode, jsonData } = await TH.testApiHandler<ApiErrorJson>(apiHandler, {
      method: 'GET',
      query: { error: 'throwWithStatusCode' },
    });

    expect(statusCode).toBe(StatusCodes.NOT_ACCEPTABLE);
  });

  it('should fail - validation error', async () => {
    const { statusCode, jsonData } = await TH.testApiHandler<ApiErrorJson>(apiHandler, {
      method: 'GET',
      query: { error: 'validationError' },
    });

    expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  it('should fail - api error', async () => {
    const { statusCode, jsonData } = await TH.testApiHandler<ApiErrorJson>(apiHandler, {
      method: 'GET',
      query: { error: 'apiError' },
    });

    expect(statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });
});
