import { StatusCodes } from 'http-status-codes';

// Define defaults
export const ERRORS = {
  // Common Errors
  INTERNAL_SERVER_ERROR: {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Unhandled error occured.',
  },
  METHOD_NOT_ALLOWED: {
    statusCode: StatusCodes.METHOD_NOT_ALLOWED,
    message: 'Method is not allowed.',
  },
  VALIDATION_ERROR: {
    statusCode: StatusCodes.BAD_REQUEST,
    message: 'Invalid data in query string or request body. Please check your request.',
  },

  // Auth Errors (authentication or authorization)
  INVALID_TOKEN: {
    statusCode: StatusCodes.UNAUTHORIZED,
    message: 'Your token is not valid.',
  },
  TOKEN_EXPIRED: {
    statusCode: StatusCodes.UNAUTHORIZED,
    message: 'The token has been expired.',
  },
} as const;

type ErrorName = keyof typeof ERRORS;

export class ApiError {
  name: ErrorName;
  message: string;
  statusCode: StatusCodes;
  stack?: string;

  constructor(name: ErrorName, message?: string, statusCode?: StatusCodes, stack?: string) {
    Error.captureStackTrace(this, this.constructor);

    this.name = name;
    this.message = message || ERRORS[name].message;
    this.statusCode = statusCode || ERRORS[name].statusCode;
    this.stack = stack;
  }

  toJson(withDetails = false): ApiErrorJson {
    return withDetails
      ? {
          name: this.name,
          message: this.message,
          stack: this.stack,
        }
      : { name: this.name, message: this.message };
  }
}

export type ApiErrorJson = Pick<ApiError, 'name' | 'message'> & { stack?: string };
