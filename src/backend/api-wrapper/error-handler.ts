import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { isResSent } from 'next/dist/shared/lib/utils';

import { ApiError } from '@src/defines/errors';
import { isProd } from '@src/utils/env';

import type { ApiWrapper } from '.';
import type { NextApiHandler } from 'next';

export const errorHandler: ApiWrapper = (handler: NextApiHandler) => async (req, res) => {
  try {
    await handler(req, res);

    if (!isResSent(res)) {
      throw new ApiError('METHOD_NOT_ALLOWED');
    }
  } catch (err) {
    if (isResSent(res)) {
      return;
    }

    const withDetails = !isProd();

    if (Joi.isError(err)) {
      const joiError = new ApiError('VALIDATION_ERROR', err.message || undefined);

      return res.status(joiError.statusCode).json(joiError.toJson(withDetails));
    }

    if (ApiError.isApiError(err)) {
      return res.status(err.statusCode).json(err.toJson(withDetails));
    }

    return res
      .status(res.statusCode >= 400 ? res.statusCode : StatusCodes.INTERNAL_SERVER_ERROR)
      .json(new ApiError('INTERNAL_SERVER_ERROR', (err as Error).message).toJson(withDetails));
  }
};
