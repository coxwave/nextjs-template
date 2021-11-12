import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { isResSent } from 'next/dist/shared/lib/utils';

import { ApiError } from '@src/defines/errors';

import { isProd } from './env';

import type { NextApiHandler } from 'next';

export function withErrorHandler(handler: NextApiHandler) {
  const wrappedHandler: NextApiHandler = async (req, res) => {
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
        const error = new ApiError('VALIDATION_ERROR', err.message || undefined);

        return res.status(error.statusCode).json(error.toJson(withDetails));
      }

      if (ApiError.isApiError(err)) {
        return res.status(err.statusCode).json(err.toJson(withDetails));
      }

      return res
        .status(res.statusCode >= 400 ? res.statusCode : StatusCodes.INTERNAL_SERVER_ERROR)
        .json(new ApiError('INTERNAL_SERVER_ERROR', (err as Error).message).toJson(withDetails));
    }
  };

  return wrappedHandler;
}
