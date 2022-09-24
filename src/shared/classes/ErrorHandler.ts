import { Response } from 'express';
import { logger } from './Logger';
import { CustomError } from './exceptions/CustomError';
import { HTTPStatusCode } from '@shared/types/HttpStatusCode';

class ErrorHandler {
    private isTrustedError(err: Error) {
        return err instanceof CustomError && err.isOperational;
    }

    private static errorResponse(name: string, statusCode: number, message: string) {
        return {
            response: 'Error',
            error: {
                name,
                statusCode,
                message,
            },
        };
    }

    private handleTrustedError(err: CustomError, res: Response) {
        const responseJson = ErrorHandler.errorResponse(err.name, err.statusCode, err.message);

        res.status(err.statusCode).json(responseJson);
        logger.debug(`${err.name}: ${err.message}`);
        logger.trace(err.stack);
    }

    private handleCriticalError(err: Error | CustomError, res?: Response) {
        if (res != null) {
            res.status(HTTPStatusCode.INTERNAL_SERVER).json(
                ErrorHandler.errorResponse(err.name, HTTPStatusCode.INTERNAL_SERVER, err.message)
            );
        }
        logger.error(err);
    }

    public handleError(err: Error | CustomError, res?: Response) {
        if (this.isTrustedError(err) && res != null) {
            this.handleTrustedError(err as CustomError, res);
        } else {
            this.handleCriticalError(err, res);
        }
    }
}

export const errorHandler = new ErrorHandler();
