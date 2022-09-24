import { readProject, readProjects } from '@controllers/projects.controller';
import { readTask, readTasks } from '@controllers/tasks.controller';
import { deleteUser, readUsers } from '@controllers/users.controller';
import { verifyJWT } from '@middlewares/verifyJWT';
import { verifyRoles } from '@middlewares/verifyRoles';
import { UserRoles } from '@shared/types/UserRoles';
import express from 'express';

export const adminRouter = express.Router();

adminRouter.use(verifyJWT);
adminRouter.use(verifyRoles(UserRoles.ADMIN));

adminRouter.get('/tasks', readTasks);
adminRouter.get('/tasks/:taskId', readTask);

adminRouter.get('/projects', readProjects);
adminRouter.get('/projects/:projectId', readProject);

adminRouter.get('/users', readUsers);
adminRouter.delete('/users/:userId', deleteUser);
