'use strict';

const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().required().email().trim(),
  password: Joi.string().required(),
  mobile: Joi.string().max(12).min(10).optional(),
  roles: Joi.array().items(Joi.string()).default([]).optional(),
  verify: Joi.boolean().default(false).optional(),
  avatar_url: Joi.string().uri().optional(),
});

const updateUserSchema = createUserSchema
  .fork(['name', 'email', 'password'], (fields) => fields.optional())
  .min(1);

const validateCreateUser = (body) => {
  return createUserSchema.validate(body, {
    abortEarly: false,
  });
};

const validateUpdateUser = (body) => {
  return updateUserSchema.validate(body, {
    abortEarly: false,
  });
};

module.exports = {
  validateCreateUser,
  validateUpdateUser,
};
