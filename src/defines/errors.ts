import { StatusCodes } from 'http-status-codes';

// Define defaults
const ERRORS = {
  // Common Errors
  INTERNAL_SERVER_ERROR: {
    name: 'InternalServerError',
    code: 'CE000',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: 'Unhandled error occured.',
  },
  METHOD_NOT_ALLOWED: {
    name: 'MethodNotAllowed',
    code: 'CE001',
    statusCode: StatusCodes.METHOD_NOT_ALLOWED,
    message: 'Method is not allowed.',
  },
  VALIDATION_ERROR: {
    name: 'ValidationError',
    code: 'CE002',
    statusCode: StatusCodes.BAD_REQUEST,
    message: 'Invalid data in query string or request body. Please check your request.',
  },

  // Auth Errors (authentication or authorization)
  INVALID_TOKEN: {
    name: 'InvalidToken',
    code: 'AE001',
    statusCode: StatusCodes.UNAUTHORIZED,
    message: 'Your token is not valid.',
  },
  TOKEN_EXPIRED: {
    name: 'TokenExpired',
    code: 'AE002',
    statusCode: StatusCodes.UNAUTHORIZED,
    message: 'The token has been expired.',
  },
} as const;

type ErrorNames = keyof typeof ERRORS;
type ErrorCodes = typeof ERRORS[keyof typeof ERRORS]['code'];

export class ApiError extends Error {
  name: ErrorNames;
  code: ErrorCodes;
  message: string;
  statusCode: StatusCodes;

  constructor(name: ErrorNames, message?: string, statusCode?: StatusCodes) {
    super();
    this.name = name;
    this.code = ERRORS[name].code;
    this.message = message ?? ERRORS[name].message ?? 'Message was not set';
    this.statusCode = statusCode ?? ERRORS[name].statusCode;
  }

  static isApiError(err: any): err is ApiError {
    return (
      err.code !== undefined &&
      err.statusCode !== undefined &&
      err.name !== undefined &&
      err.message !== undefined
    );
  }

  toJson(withDetails = false) {
    return {
      name: this.name,
      code: this.code,
      message: withDetails ? this.message : undefined,
      stack: withDetails ? this.stack : undefined,
    };
  }
}
