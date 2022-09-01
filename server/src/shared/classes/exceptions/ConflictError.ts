import { HTTPStatusCode } from '@shared/types/HttpStatusCode';
import { APIError } from './APIError';

export class ConflictError extends APIError {
  constructor(dupItem: string) {
    const message = `'${dupItem}' is already existed`;
    super('Conflicted', HTTPStatusCode.CONFLICT, message);
  }
}
