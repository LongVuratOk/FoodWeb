'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const { updateSearchIndex } = require('../models/product.model');
const { findByCategoryId } = require('../models/repositories/category.repo');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  queryProduct,
  searchProduct,
  publishedProduct,
  unPublishedProduct,
  findByProductId,
} = require('../models/repositories/product.repo');
const { getInfoData } = require('../utils');
const {
  validateCreateProduct,
  validateUpdateProduct,
} = require('../validations/product.valid');

class ProductService {
  static getAllProducts = async ({
    limit = 50,
    sort = 'ctime',
    page = 1,
    category,
    priceFrom,
    priceTo,
    rating,
  }) => {
    const filter = {};
    if (category) filter.product_category = category;
    if (priceFrom || priceTo) {
      filter.product_price = {};
      if (priceFrom) {
        filter.product_price.$gte = priceFrom;
      }
      if (priceTo) {
        filter.product_price.$lte = priceTo;
      }
    }
    if (rating) {
      filter.product_ratingsAverage = {};
      filter.product_ratingsAverage.$gte = rating;
    }
    return await queryProduct({ limit, sort, page, filter });
  };

  static getAllProductsDraff = async ({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isDraff: true },
  }) => {
    return await queryProduct({ limit, sort, page, filter });
  };

  static getAllProductsPublished = async ({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
  }) => {
    return await queryProduct({ limit, sort, page, filter });
  };

  static getProduct = async ({ product_id }) => {
    const result = await findByProductId(product_id);
    if (!result) {
      throw new NotFoundError('Không tìm thấy sản phẩm');
    }

    return result;
  };

  static searchProduct = async ({ keySearch }) => {
    return await searchProduct({ keySearch });
  };

  static publishedProduct = async ({ product_id }) => {
    const result = await publishedProduct({ product_id });
    if (!result) {
      throw new NotFoundError('Không tìm thấy sản phẩm');
    }

    return result;
  };

  static unPublishedProduct = async ({ product_id }) => {
    const result = await unPublishedProduct({ product_id });
    if (!result) {
      throw new NotFoundError('Không tìm thấy sản phẩm');
    }

    return result;
  };

  static createProduct = async (body) => {
    const { error } = validateCreateProduct(body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const foundCategory = await findByCategoryId(body?.product_category);
    if (!foundCategory) {
      throw new NotFoundError('Không tìm thấy danh mục');
    }

    return await createProduct(body);
  };

  static updateProduct = async (productId, bodyUpdate) => {
    const { error } = validateUpdateProduct(bodyUpdate);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const updated = await updateProduct({ productId, bodyUpdate });
    if (!updateSearchIndex) {
      throw new NotFoundError('Không tìm thấy sản phẩm');
    }

    return updated;
  };

  static deleteProduct = async (productId) => {
    const deleted = await deleteProduct(productId);
    if (!deleted) {
      throw new NotFoundError('Không tìm thấy sản phẩm');
    }

    return deleted;
  };
}

module.exports = ProductService;
