import { Project } from '@models/project.model';
import { APIError } from '@shared/classes/exceptions';
import { logger } from '@shared/classes/Logger';
import { HTTPStatusCode } from '@shared/types/HttpStatusCode';
import { Request, NextFunction, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema } from 'express-joi-validation';

interface CreateProjectReuest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    description?: string;
  };
}

interface EditProjectRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    [key: string]: string | number | Date | undefined;
    name?: string;
    description?: string;
  };
}

export const readProjects = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const projects = await Project.find().exec();
  logger.trace(projects);
  res.json(projects);
});

export const readProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.params.projectId === '') {
    next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'projectId is required'));
    return;
  }
  const project = await Project.findById(req.params.projectId).exec();
  logger.trace(project);
  res.json(project);
});

export const createProject = asyncHandler(
  async (req: ValidatedRequest<CreateProjectReuest>, res: Response, next: NextFunction) => {
    const result = await Project.create({
      name: req.body.name,
      description: req.body.description,
      userId: req.context?.decodedPayload.user,
    });
    logger.trace(result);

    res.status(201).json({ success: `New project ${req.body.name} created.` });
  }
);

export const editProject = asyncHandler(
  async (req: ValidatedRequest<EditProjectRequest>, res: Response, next: NextFunction) => {
    if (req.params.projectId === '') {
      next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'projectId is required'));
      return;
    }
    const project = await Project.findById(req.params.projectId).exec();
    if (project == null) {
      next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'Can not find project'));
      return;
    }
    for (const key of Object.keys(req.body)) {
      if (req.body[key] !== undefined) {
        project.set(key, req.body[key]);
      }
    }
    const result = await project.save();
    logger.trace(result);
    res.json(result);
  }
);

export const deleteProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.params.projectId === '') {
    next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'projectId is required'));
    return;
  }
  const project = await Project.findById(req.params.projectId).exec();
  if (project == null) {
    next(new APIError('Bad request', HTTPStatusCode.BAD_REQUEST, 'Can not find project'));
    return;
  }
  const result = await project.deleteOne();
  logger.trace(result);
  res.json({ message: `Project ${project.name} deleted.` });
});
