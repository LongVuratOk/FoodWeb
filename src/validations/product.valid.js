'use strict';

const Joi = require('joi');
const { objectIdPattern } = require('../constants/type.ObjectId');

const createProductSchema = Joi.object({
  product_name: Joi.string().required().trim(),
  product_thumb: Joi.string().uri().required(),
  product_price: Joi.number().required().min(0),
  product_quatity: Joi.number().required().min(0),
  product_category: Joi.string().regex(objectIdPattern).required().messages({
    'string.pattern.base':
      'product_category must be a valid ObjectId (24 hex characters)',
  }),
  product_createBy: Joi.string().regex(objectIdPattern).optional().messages({
    'string.pattern.base':
      'product_category must be a valid ObjectId (24 hex characters)',
  }),
  product_updateBy: Joi.string().regex(objectIdPattern).optional().messages({
    'string.pattern.base':
      'product_category must be a valid ObjectId (24 hex characters)',
  }),

  product_ratingsAverage: Joi.number().default(4.5).min(1).max(5),
  isDraff: Joi.boolean().default(true).optional(),
  isPublished: Joi.boolean().default(false).optional(),
});

const updateProductSchema = createProductSchema
  .fork(
    [
      'product_name',
      'product_thumb',
      'product_price',
      'product_quatity',
      'product_category',
    ],
    (fields) => fields.optional(),
  )
  .min(1);

const validateCreateProduct = (body) => {
  return createProductSchema.validate(body, {
    abortEarly: false,
  });
};

const validateUpdateProduct = (body) => {
  return updateProductSchema.validate(body, {
    abortEarly: false,
  });
};

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
};
