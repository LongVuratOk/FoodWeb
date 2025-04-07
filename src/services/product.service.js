'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { findByCategoryId } = require('../models/repositories/category.repo');
const {
  createProduct,
  updateProduct,
} = require('../models/repositories/product.repo');
const { getInfoData } = require('../utils');
const {
  validateCreateProduct,
  validateUpdateProduct,
} = require('../validations/product.valid');

class ProductService {
  static createProduct = async (body) => {
    const { error } = validateCreateProduct(body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const foundCategory = await findByCategoryId(body?.product_category);
    if (!foundCategory) {
      throw new NotFoundError('category is not found');
    }

    return await createProduct(body);
  };

  static updateProduct = async (productId, bodyUpdate) => {
    const { error } = validateUpdateProduct(bodyUpdate);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    return await updateProduct({ productId, bodyUpdate });
  };
}

module.exports = ProductService;
