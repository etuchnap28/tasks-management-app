import { CustomError } from '@shared/classes/exceptions/CustomError';
import { errorHandler } from '@shared/classes/ErrorHandler';
import { NextFunction, Request, Response } from 'express';
import { ExpressJoiError } from 'express-joi-validation';
import { ValidationError } from '@shared/classes/exceptions';

export const validationErrMiddleware = (err: ExpressJoiError, req: Request, res: Response, next: NextFunction) => {
    const message = err.error != null ? err.error.message.replace(/"/g, "'") : 'validation error';
    const error = new ValidationError(message);

    next(error);
};

export const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    errorHandler.handleError(err, res);
};
