import asyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import { User } from '@models/user.model';
import { APIError } from '@shared/classes/exceptions';
import { HTTPStatusCode } from '@shared/types/HttpStatusCode';
import { logger } from '@shared/classes/Logger';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';

interface EditUserRequest extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        [key: string]: string | undefined;
        firstname?: string;
        lastname?: string;
    };
}

interface ChangePasswordRequest extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        oldPwd: string;
        newPwd: string;
    };
}

export const editUser = asyncHandler(
    async (req: ValidatedRequest<EditUserRequest>, res: Response, next: NextFunction) => {
        const userId = req.context?.decodedPayload.user;
        if (userId === undefined) {
            next(new APIError('Bad request', HTTPStatusCode.UNAUTHORIZED, 'Unauthorized'));
            return;
        }
        const user = await User.findById(userId).exec();
        if (user == null) {
            next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'Can not find user'));
            return;
        }
        for (const key of Object.keys(req.body)) {
            if (req.body[key] !== undefined) {
                user.set(key, req.body[key]);
            }
        }
        const result = await user.save();
        logger.trace(result);
        res.json(result);
    }
);

export const changePassword = asyncHandler(
    async (req: ValidatedRequest<ChangePasswordRequest>, res: Response, next: NextFunction) => {
        const userId = req.context?.decodedPayload.user;
        if (userId === undefined) {
            next(new APIError('Bad request', HTTPStatusCode.UNAUTHORIZED, 'Unauthorized'));
            return;
        }
        const user = await User.findById(userId).exec();
        if (user == null) {
            next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'can not find user'));
            return;
        }
        const match = await user.comparePassword(req.body.oldPwd);
        if (!match) {
            next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'password does not match'));
            return;
        }
        user.password = req.body.newPwd;
        const result = await user.save();
        logger.trace(result);
        res.json(result);
    }
);

export const readUsers = asyncHandler(async (req: Request, res: Response) => {
    const result = await User.find().exec();
    logger.trace(result);
    res.json(result);
});

export const readUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.userId === '') {
        next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'userId is required'));
        return;
    }
    const result = await User.findById(req.params.userId).exec();
    logger.trace(result);
    res.json(result);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.userId === '') {
        next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'userId is required'));
        return;
    }
    const user = await User.findById(req.params.userId).exec();
    if (user == null) {
        next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'can not find user'));
        return;
    }
    const result = await user.deleteOne();
    logger.trace(result);
    res.json({ message: `user ${user.email} deleted.` });
});
