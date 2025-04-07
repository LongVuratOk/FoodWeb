'use strict';

const { CREATED, OK } = require('../../core/success.response');
const ProductService = require('../../services/product.service');

class ProductController {
  createProduct = async (req, res, next) => {
    new CREATED({
      message: 'Create Product successfully',
      metadata: await ProductService.createProduct({
        ...req.body,
        product_createBy: req.user.userId,
        product_updateBy: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new OK({
      message: 'Update Product successfully',
      metadata: await ProductService.updateProduct(req.params._id, {
        ...req.body,
        product_updateBy: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
