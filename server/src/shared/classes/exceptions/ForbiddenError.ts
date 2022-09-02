import { HTTPStatusCode } from '@shared/types/HttpStatusCode';
import { APIError } from './APIError';

export class ForbiddenError extends APIError {
  constructor(message = 'forbidden') {
    super('Forbidden', HTTPStatusCode.FORBIDDEN, message);
  }
}
