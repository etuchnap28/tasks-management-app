import { changePassword, editUser, readUser } from '@controllers/users.controller';
import { validationErrMiddleware } from '@middlewares/errorMiddleware';
import { verifyJWT } from '@middlewares/verifyJWT';
import { verifyRoles } from '@middlewares/verifyRoles';
import { changePasswordSchema, editUserSchema } from '@models/validations/user.validation';
import { validator } from '@models/validations/validator';
import { UserRoles } from '@shared/types/UserRoles';
import express from 'express';

export const usersRouter = express.Router();

usersRouter.use(verifyJWT);
usersRouter.use(verifyRoles(UserRoles.ADMIN, UserRoles.USER));

usersRouter.get('/:userId', readUser);
usersRouter.patch(
  '/:userId/changePassword',
  validator.body(changePasswordSchema),
  validationErrMiddleware,
  changePassword
);
usersRouter.patch('/:userId', validator.body(editUserSchema), validationErrMiddleware, editUser);
