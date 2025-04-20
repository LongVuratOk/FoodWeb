'use strict';

const Joi = require('joi');
const { objectIdPattern } = require('../constants/type.ObjectId');

const createDiscountSchema = Joi.object({
  name: Joi.string().required().trim(),
  description: Joi.string().required(),
  type: Joi.string().default('fixed_amount').optional(),
  value: Joi.number().required().min(0).max(100),
  max_value: Joi.number().required(),
  code: Joi.string().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  max_uses: Joi.number().required(),
  uses_count: Joi.number().required(),
  users_used: Joi.array().default([]).optional(),
  max_uses_per_user: Joi.number().required(),
  min_order_value: Joi.number().required(),
  createBy: Joi.string().regex(objectIdPattern).required().messages({
    'string.pattern.base':
      'createBy must be a valid ObjectId (24 hex characters)',
  }),
  is_active: Joi.boolean().default(true).optional(),
  applies_to: Joi.string().required(),
  product_ids: Joi.array().default([]).optional(),
});

const updateDiscountSchema = createDiscountSchema
  .fork(
    [
      'name',
      'description',
      'value',
      'max_value',
      'code',
      'start_date',
      'end_date',
      'max_uses',
      'uses_count',
      'max_uses_per_user',
      'min_order_value',
      'createBy',
      'applies_to',
    ],
    (fields) => fields.optional(),
  )
  .min(1);

const validateCreateDiscount = (body) => {
  return createDiscountSchema.validate(body, {
    abortEarly: false,
  });
};

const validateUpdateDiscount = (body) => {
  return updateDiscountSchema.validate(body, {
    abortEarly: false,
  });
};

module.exports = {
  validateCreateDiscount,
  validateUpdateDiscount,
};
