'use strict';

const ProductModel = require('../product.model');

const createProduct = async (body) => {
  return await ProductModel.create(body);
};

const updateProduct = async ({ productId, bodyUpdate, isNew = true }) => {
  return await ProductModel.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
  });
};

const findByProductId = async (id) => {
  return await ProductModel.findById(id);
};

module.exports = {
  findByProductId,
  createProduct,
  updateProduct,
};
