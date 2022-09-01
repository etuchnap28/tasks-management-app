import { readProject, readProjects, createProject } from '@controllers/projects.controller';
import { validationErrMiddleware } from '@middlewares/errorMiddleware';
import { verifyJWT } from '@middlewares/verifyJWT';
import { createProjectSchema } from '@models/validations/project.validation';
import { validator } from '@models/validations/validator';
import express from 'express';

export const projectsRouter = express.Router();

projectsRouter.use(verifyJWT);

projectsRouter.get('/', readProjects);
projectsRouter.get('/:projectId', readProject);
projectsRouter.post('/', validator.body(createProjectSchema), validationErrMiddleware, createProject);
