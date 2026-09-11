/** Typed error hierarchy used by the api and repository layers. */

export class AppError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network request failed. Please try again.') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'The requested item could not be found.') {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  field?: string;

  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'You are not authorized to perform this action.') {
    super(message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export function toErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
}
