import { login, logout, refresh, register } from '@controllers/auth.controller';
import express from 'express';
import { validationErrMiddleware } from '@middlewares/errorMiddleware';
import { loginSchema, registerSchema } from '@models/validations/auth.validation';
import { validator } from '@models/validations/validator';

export const authRouter = express.Router();

authRouter.post('/login', validator.body(loginSchema), validationErrMiddleware, login);
authRouter.post('/register', validator.body(registerSchema), validationErrMiddleware, register);
authRouter.get('/logout', logout);
authRouter.get('/refresh', refresh);
