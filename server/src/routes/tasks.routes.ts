import express from 'express';
import { createTask, deleteTask, editTask, readTask, readTasks } from '@controllers/tasks.controller';
import { validationErrMiddleware } from '@middlewares/errorMiddleware';
import { verifyJWT } from '@middlewares/verifyJWT';
import { createTaskSchema, editTaskSchema } from '@models/validations/task.validation';
import { validator } from '@models/validations/validator';

export const tasksRouter = express.Router();

tasksRouter.use(verifyJWT);

tasksRouter.get('/', readTasks);
tasksRouter.get('/:taskId', readTask);
tasksRouter.post('/', validator.body(createTaskSchema), validationErrMiddleware, createTask);
tasksRouter.patch('/:taskId', validator.body(editTaskSchema), validationErrMiddleware, editTask);
tasksRouter.delete('/:taskId', deleteTask);
