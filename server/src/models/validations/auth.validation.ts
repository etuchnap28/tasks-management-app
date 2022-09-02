import { UserRoles } from '@shared/types/UserRoles';
import joi from 'joi';

export const loginSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});

export const registerSchema = joi.object({
  firstname: joi
    .string()
    .required()
    .pattern(/^[A-z][A-z\s]{0,23}$/),
  lastname: joi
    .string()
    .required()
    .pattern(/^[A-z][A-z\s]{0,23}$/),
  email: joi.string().required().email(),
  password: joi
    .string()
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/),
  roles: joi.object({
    Admin: joi
      .number()
      .integer()
      .required()
      .equal(UserRoles.ADMIN)
      .messages({ 'any.only': `"Admin" value is not valid` }),
  }),
});
