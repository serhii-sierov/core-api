import Joi from 'joi';

export const signUpInputValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  device: Joi.string().optional(),
});
