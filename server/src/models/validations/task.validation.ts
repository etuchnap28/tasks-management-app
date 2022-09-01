import joi from 'joi';

export const createTaskSchema = joi.object({
  name: joi.string().required().min(1),
  projectId: joi.string().length(24),
  description: joi.string().min(1),
  priority: joi.number().integer().min(0).max(4),
  dueDate: joi.date().min('now'),
});

export const editTaskSchema = joi.object({
  name: joi.string().min(1),
  description: joi.string().min(1),
  priority: joi.number().integer().min(0).max(4),
  dueDate: joi.date().min('now'),
});
