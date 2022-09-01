import { readProject, readProjects, createProject, editProject, deleteProject } from '@controllers/projects.controller';
import { validationErrMiddleware } from '@middlewares/errorMiddleware';
import { verifyJWT } from '@middlewares/verifyJWT';
import { createProjectSchema, editProjectSchema } from '@models/validations/project.validation';
import { validator } from '@models/validations/validator';
import express from 'express';

export const projectsRouter = express.Router();

projectsRouter.use(verifyJWT);

projectsRouter.get('/', readProjects);
projectsRouter.get('/:projectId', readProject);
projectsRouter.post('/', validator.body(createProjectSchema), validationErrMiddleware, createProject);
projectsRouter.patch('/:projectId', validator.body(editProjectSchema), validationErrMiddleware, editProject);
projectsRouter.delete('/:projectId', deleteProject);
