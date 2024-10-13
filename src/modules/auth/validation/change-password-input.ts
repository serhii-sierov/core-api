import Joi from 'joi';

export const changePasswordInputValidationSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().invalid(Joi.ref('oldPassword')).required(),
});
