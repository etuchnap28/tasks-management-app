import { config } from '@config/config';
import { AuthorizationError } from '@shared/classes/exceptions';
import { DecodedPayload } from '@shared/types';
import { Request, NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization as string;

    if (!authHeader?.startsWith('Bearer ')) {
        next(new AuthorizationError('no token found'));
        return;
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, config.jwt.accessTokenSecret, (err, decoded) => {
        if (err !== null) {
            next(new AuthorizationError('token is invalid'));
            return;
        }
        req.context = { ...req.context, decodedPayload: decoded as DecodedPayload };
        next();
    });
};
