import { readUser, readUsers } from '@controllers/users.controller';
import { verifyJWT } from '@middlewares/verifyJWT';
import express from 'express';

export const usersRouter = express.Router();

usersRouter.use(verifyJWT);

usersRouter.get('/', readUsers);
usersRouter.get('/:userId', readUser);
