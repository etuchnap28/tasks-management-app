import joi from 'joi';

export const editUserSchema = joi.object({
  firstname: joi.string().pattern(/^[A-z][A-z\s]{0,23}$/),
  lastname: joi.string().pattern(/^[A-z][A-z\s]{0,23}$/),
});

export const changePasswordSchema = joi.object({
  newPwd: joi
    .string()
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/),
  oldPwd: joi
    .string()
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/),
});
