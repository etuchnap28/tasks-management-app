import { HTTPStatusCode } from '@shared/types/HttpStatusCode';
import { APIError } from './APIError';

export class ValidationError extends APIError {
    constructor(message = 'validation error') {
        super('Validation Error', HTTPStatusCode.BAD_REQUEST, message);
    }
}
