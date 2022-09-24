import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { logger } from '@shared/classes/Logger';
import { CustomError } from '@shared/classes/exceptions';
import { HTTPStatusCode } from '@shared/types/HttpStatusCode';
import { errorHandler } from '@shared/classes/ErrorHandler';

import { connectDB } from '@config/dbConn';
import { config } from '@config/config';

import { morganMiddleware } from '@middlewares/logEvents';
import { errorMiddleware } from '@middlewares/errorMiddleware';

import { authRouter } from '@routes/auth.routes';
import { usersRouter } from '@routes/users.routes';
import { projectsRouter } from '@routes/projects.routes';
import { tasksRouter } from '@routes/tasks.routes';
import { adminRouter } from '@routes/admin.routes';

const app = express();

/* Connect to DB */
connectDB().catch(err => logger.error(err));

/* Middlewares */
app.use(morganMiddleware);
app.use(cors(config.server.corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

/* Healthcheck */
app.get('/ping', (req: Request, res: Response) => res.status(200).json({ message: 'pong' }));

/* Routes */
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/projects', projectsRouter);
app.use('/tasks', tasksRouter);

/* Error handling */
app.all('*', (req: Request, res: Response, next: NextFunction) =>
    next(new CustomError('Not found', HTTPStatusCode.NOT_FOUND, `${req.method} ${req.path} not found.`, true))
);
app.use(errorMiddleware);

/* Connect to MongoDB and start server */
mongoose.connection.once('connected', () => {
    logger.info('Connected to MongoDB');
    app.listen(config.server.port, () => logger.info(`Server is running on port ${config.server.port}`));
});

process.on('unhandledRejection', (reason: Error) => {
    throw reason;
});

process.on('uncaughtException', (err: Error) => {
    errorHandler.handleError(err);
});
