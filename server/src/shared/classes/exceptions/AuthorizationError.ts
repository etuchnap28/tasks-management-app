import { HTTPStatusCode } from '@shared/types/HttpStatusCode';
import { APIError } from './APIError';

export class AuthorizationError extends APIError {
  constructor(message = 'unauthorized') {
    super('Unauthorized', HTTPStatusCode.UNAUTHORIZED, message);
  }
}
