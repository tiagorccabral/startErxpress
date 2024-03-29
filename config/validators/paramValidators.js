const Joi = require('@hapi/joi');

export const createUserValidator = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  userType: Joi.string().required(),
  first_name: Joi.string(),
  last_name: Joi.string(),
});

export const loginValidator = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});