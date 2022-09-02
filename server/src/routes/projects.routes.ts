import {
  createProject,
  editProject,
  deleteProject,
  readProjectsByUser,
  readProjectByUser,
} from '@controllers/projects.controller';
import { validationErrMiddleware } from '@middlewares/errorMiddleware';
import { verifyJWT } from '@middlewares/verifyJWT';
import { verifyRoles } from '@middlewares/verifyRoles';
import { createProjectSchema, editProjectSchema } from '@models/validations/project.validation';
import { validator } from '@models/validations/validator';
import { UserRoles } from '@shared/types/UserRoles';
import express from 'express';

export const projectsRouter = express.Router();

projectsRouter.use(verifyJWT);
projectsRouter.use(verifyRoles(UserRoles.ADMIN, UserRoles.USER));

projectsRouter.get('/', readProjectsByUser);
projectsRouter.post('/', validator.body(createProjectSchema), validationErrMiddleware, createProject);
projectsRouter.get('/:projectId', readProjectByUser);
projectsRouter.patch('/:projectId', validator.body(editProjectSchema), validationErrMiddleware, editProject);
projectsRouter.delete('/:projectId', deleteProject);
