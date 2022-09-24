import express from 'express';
import { createTask, deleteTask, editTask, readTaskByUser, readTasksByUser } from '@controllers/tasks.controller';
import { validationErrMiddleware } from '@middlewares/errorMiddleware';
import { verifyJWT } from '@middlewares/verifyJWT';
import { createTaskSchema, editTaskSchema } from '@models/validations/task.validation';
import { validator } from '@models/validations/validator';
import { verifyRoles } from '@middlewares/verifyRoles';
import { UserRoles } from '@shared/types/UserRoles';

export const tasksRouter = express.Router();

tasksRouter.use(verifyJWT);
tasksRouter.use(verifyRoles(UserRoles.ADMIN, UserRoles.USER));

tasksRouter.get('/', readTasksByUser);
tasksRouter.post('/', validator.body(createTaskSchema), validationErrMiddleware, createTask);
tasksRouter.get('/:taskId', readTaskByUser);
tasksRouter.patch('/:taskId', validator.body(editTaskSchema), validationErrMiddleware, editTask);
tasksRouter.delete('/:taskId', deleteTask);
