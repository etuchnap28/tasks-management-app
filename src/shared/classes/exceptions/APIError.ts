import { HTTPStatusCode } from '@shared/types/HttpStatusCode';
import { CustomError } from './CustomError';

export class APIError extends CustomError {
    constructor(
        name: string,
        statusCode = HTTPStatusCode.INTERNAL_SERVER,
        message = 'internal server error',
        isOperational = true
    ) {
        super(name, statusCode, message, isOperational);
    }
}
