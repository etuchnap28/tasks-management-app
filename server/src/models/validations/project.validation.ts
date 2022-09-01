import joi from 'joi';

export const createProjectSchema = joi.object({
  name: joi.string().required(),
  description: joi.string(),
});
