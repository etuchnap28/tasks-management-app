import { User } from '@models/user.model';
import { AuthorizationError, ForbiddenError } from '@shared/classes/exceptions';
import { logger } from '@shared/classes/Logger';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';

export const verifyRoles = (...allowdRoles: number[]) => {
    return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.context?.decodedPayload.user;
        if (userId === undefined) {
            next(new AuthorizationError());
            return;
        }
        const user = await User.findById(userId).exec();
        if (user == null) {
            next(new ForbiddenError());
            return;
        }
        const userRoles = Object.values(user.toObject().roles).filter(Boolean);
        const rolesArray = [...allowdRoles];
        const result = userRoles.map(role => rolesArray.includes(role)).find(val => val);
        logger.trace(result);
        if (!(result ?? false)) {
            next(new ForbiddenError());
            return;
        }
        next();
    });
};
