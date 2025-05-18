'use strict';

const Joi = require('joi');
const { objectIdPattern } = require('../constants/type.ObjectId');

const createOrderSchema = Joi.object({
  customer: Joi.string().required().trim(),
  address: Joi.string().required(),
  phone: Joi.string().default(true).optional(),
  total_money: Joi.number().required(),
  payment_method: Joi.string()
    .valid('online', 'on delivery')
    .default('on delivery')
    .optional(),
  is_payment: Joi.boolean().default(false).optional(),
  status: Joi.string()
    .valid('pending', 'confirm', 'ship', 'receive')
    .default('pending')
    .optional(),
  cart_id: Joi.string().regex(objectIdPattern).required().messages({
    'string.pattern.base':
      'createBy must be a valid ObjectId (24 hex characters)',
  }),
});

const updateOrderSchema = createOrderSchema
  .fork(['customer', 'address', 'phone', 'total_money', 'cart_id'], (fields) =>
    fields.optional(),
  )
  .min(1);

const validateCreateOrder = (body) => {
  return createOrderSchema.validate(body, {
    abortEarly: false,
  });
};

const validateUpdateOrder = (body) => {
  return updateOrderSchema.validate(body, {
    abortEarly: false,
  });
};

module.exports = {
  validateCreateOrder,
  validateUpdateOrder,
};
