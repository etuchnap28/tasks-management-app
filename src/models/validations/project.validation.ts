import joi from 'joi';

export const createProjectSchema = joi.object({
    name: joi.string().required().min(1),
    description: joi.string(),
});

export const editProjectSchema = joi.object({
    name: joi.string().min(1),
    description: joi.string(),
});
