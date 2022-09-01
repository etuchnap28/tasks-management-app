import { Task } from '@models/task.model';
import { APIError } from '@shared/classes/exceptions';
import { logger } from '@shared/classes/Logger';
import { HTTPStatusCode } from '@shared/types/HttpStatusCode';
import { Request, NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';
import { Types } from 'mongoose';

interface CreateTaskRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    [key: string]: Types.ObjectId | string | number | Date | undefined;
    name: string;
    projectId?: Types.ObjectId;
    description?: string;
    priority?: number;
    dueDate: Date;
  };
}

interface EditTaskRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    [key: string]: string | number | Date | undefined;
    name?: string;
    description?: string;
    priority?: number;
    dueDate?: Date;
  };
}

export const createTask = asyncHandler(
  async (req: ValidatedRequest<CreateTaskRequest>, res: Response, next: NextFunction) => {
    const task = new Task();
    for (const key of Object.keys(req.body)) {
      if (req.body[key] !== undefined) {
        task.set(key, req.body[key]);
      }
    }
    if (req.context != null) {
      task.userId = req.context.decodedPayload.user;
    }
    const result = await task.save();
    logger.trace(result);
    res.status(201).json({ message: `Task ${task.name} created.` });
  }
);

export const readTasks = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tasks = await Task.find().exec();
  logger.trace(tasks);
  res.json(tasks);
});

export const readTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.params.taskId === '') {
    next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'taskId is required'));
    return;
  }
  const task = await Task.findById(req.params.taskId).exec();
  logger.trace(task);
  res.json(task);
});

export const editTask = asyncHandler(
  async (req: ValidatedRequest<EditTaskRequest>, res: Response, next: NextFunction) => {
    if (req.params.taskId === '') {
      next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'taskId is required'));
      return;
    }
    const task = await Task.findById(req.params.taskId).exec();
    if (task == null) {
      next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'Can not find task'));
      return;
    }
    for (const key of Object.keys(req.body)) {
      if (req.body[key] !== undefined) {
        task.set(key, req.body[key]);
      }
    }
    const result = await task.save();
    logger.trace(result);
    res.json(result);
  }
);

export const deleteTask = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.params.taskId === '') {
    next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'taskId is required'));
    return;
  }
  const task = await Task.findById(req.params.taskId).exec();
  if (task == null) {
    next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'Can not find task'));
    return;
  }
  const result = await task.deleteOne();
  logger.trace(result);
  res.json({ message: `Task ${task.name} deleted.` });
});
