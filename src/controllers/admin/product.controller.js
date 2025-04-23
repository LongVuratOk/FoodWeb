'use strict';

const { CREATED, OK } = require('../../core/success.response');
const ProductService = require('../../services/product.service');

class ProductController {
  getAllProducts = async (req, res, next) => {
    new OK({
      message: 'Lấy danh sách sản phẩm thành công',
      metadata: await ProductService.getAllProducts(req.query),
    }).send(res);
  };

  getProduct = async (req, res, next) => {
    new OK({
      message: 'Lấy chi tiết sản phẩm thành công',
      metadata: await ProductService.getProduct({ product_id: req.params._id }),
    }).send(res);
  };

  getAllProductsDraff = async (req, res, next) => {
    new OK({
      message: 'Lấy danh sách sản phẩm nháp thành công',
      metadata: await ProductService.getAllProductsDraff(req.query),
    }).send(res);
  };

  getAllProductsPublished = async (req, res, next) => {
    new OK({
      message: 'Lấy danh sách sản phẩm công khai thành công',
      metadata: await ProductService.getAllProductsPublished(req.query),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new OK({
      message: 'Lấy danh sách sản phẩm tìm kiếm thành công',
      metadata: await ProductService.searchProduct(req.params),
    }).send(res);
  };

  publishedProduct = async (req, res, next) => {
    new OK({
      message: 'Công khai sản phẩm thành công',
      metadata: await ProductService.publishedProduct({
        product_id: req.params._id,
      }),
    }).send(res);
  };

  unPublishedProduct = async (req, res, next) => {
    new OK({
      message: 'Thay đổi sản phẩm vào bản nháp thành công',
      metadata: await ProductService.unPublishedProduct({
        product_id: req.params._id,
      }),
    }).send(res);
  };

  createProduct = async (req, res, next) => {
    new CREATED({
      message: 'Tạo sản phẩm thành công',
      metadata: await ProductService.createProduct({
        ...req.body,
        product_createBy: req.user.userId,
        product_updateBy: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new OK({
      message: 'Cập nhật sản phẩm thành công',
      metadata: await ProductService.updateProduct(req.params._id, {
        ...req.body,
        product_updateBy: req.user.userId,
      }),
    }).send(res);
  };

  deleteProduct = async (req, res, next) => {
    new OK({
      message: 'Xóa sản phẩm thành công',
      metadata: await ProductService.deleteProduct(req.params._id),
    }).send(res);
  };
}

module.exports = new ProductController();
