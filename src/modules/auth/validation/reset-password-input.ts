import Joi from 'joi';

export const resetPasswordInputValidationSchema = Joi.object({
  email: Joi.string().email().required(),
});
