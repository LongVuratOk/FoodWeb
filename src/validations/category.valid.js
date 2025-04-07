'use strict';

const Joi = require('joi');

const createCategorySchema = Joi.object({
  category_name: Joi.string().required().trim(),
  category_img: Joi.string().uri().optional(),
  isDraff: Joi.boolean().default(true).optional(),
  isPublished: Joi.boolean().default(false).optional(),
});

const updateCategorySchema = createCategorySchema
  .fork(['category_name'], (fields) => fields.optional())
  .min(1);

const validateCreateCategory = (body) => {
  return createCategorySchema.validate(body, {
    abortEarly: false,
  });
};

const validateUpdateCategory = (body) => {
  return updateCategorySchema.validate(body, {
    abortEarly: false,
  });
};

module.exports = {
  validateCreateCategory,
  validateUpdateCategory,
};
