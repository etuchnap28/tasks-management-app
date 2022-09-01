/* Self-defined error class */
import { HTTPStatusCode } from '@shared/types/HttpStatusCode';

export class CustomError extends Error {
  public readonly name: string;
  public readonly statusCode: HTTPStatusCode;
  public readonly isOperational: boolean;

  constructor(name: string, statusCode: HTTPStatusCode, message: string, isOperational: boolean) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
