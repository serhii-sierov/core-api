import Joi from 'joi';

export const signInInputValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  device: Joi.string().optional(),
});
