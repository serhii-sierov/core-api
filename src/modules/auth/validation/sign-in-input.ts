import Joi from 'joi';

export const signInInputValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  rememberMe: Joi.boolean().optional(),
  device: Joi.string().optional(),
});
