'use strict';

const { CREATED, OK } = require('../../core/success.response');
const ProductService = require('../../services/product.service');

class ProductController {
  getAllProducts = async (req, res, next) => {
    new OK({
      message: 'Get all product successfully',
      metadata: await ProductService.getAllProducts(req.query),
    }).send(res);
  };

  getAllProductsDraff = async (req, res, next) => {
    new OK({
      message: 'Get all product draff successfully',
      metadata: await ProductService.getAllProductsDraff(req.query),
    }).send(res);
  };

  getAllProductsPublished = async (req, res, next) => {
    new OK({
      message: 'Get all product published successfully',
      metadata: await ProductService.getAllProductsPublished(req.query),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new OK({
      message: 'Search product successfully',
      metadata: await ProductService.searchProduct(req.params),
    }).send(res);
  };

  publishedProduct = async (req, res, next) => {
    new OK({
      message: 'Published product successfully',
      metadata: await ProductService.publishedProduct({
        product_id: req.params._id,
      }),
    }).send(res);
  };

  unPublishedProduct = async (req, res, next) => {
    new OK({
      message: 'unPublished product successfully',
      metadata: await ProductService.unPublishedProduct({
        product_id: req.params._id,
      }),
    }).send(res);
  };

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

  deleteProduct = async (req, res, next) => {
    new OK({
      message: 'Delete Product successfully',
      metadata: await ProductService.deleteProduct(req.params._id),
    }).send(res);
  };
}

module.exports = new ProductController();
