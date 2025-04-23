'use strict';

const { OK, CREATED } = require('../../core/success.response');
const CategoryService = require('../../services/category.service');

class CategoryController {
  publishCategory = async (req, res, next) => {
    new OK({
      message: 'Công khai danh mục thành công',
      metadata: await CategoryService.publishCategory({
        category_id: req.params._id,
      }),
    }).send(res);
  };

  unPublishCategory = async (req, res, next) => {
    new OK({
      message: 'Thay đổi danh mục vào bản pháp',
      metadata: await CategoryService.unPublishCategory({
        category_id: req.params._id,
      }),
    }).send(res);
  };

  createCategory = async (req, res, next) => {
    new CREATED({
      message: 'Tạo danh mục thành công',
      metadata: await CategoryService.createCategory(req.body),
    }).send(res);
  };

  updateCategory = async (req, res, next) => {
    new OK({
      message: 'Cập nhật danh mục thành công',
      metadata: await CategoryService.updateCategory({
        category_id: req.params._id,
        bodyUpdate: req.body,
      }),
    }).send(res);
  };

  deleteCategory = async (req, res, next) => {
    new OK({
      message: 'Xóa danh mục thành công',
      metadata: await CategoryService.deleteCategory({
        category_id: req.params._id,
      }),
    }).send(res);
  };

  getAllCategories = async (req, res, next) => {
    new OK({
      message: 'Lấy danh sách danh mục thành công',
      metadata: await CategoryService.getAllCategories(req.query),
    }).send(res);
  };

  getAllCategoriesPublish = async (req, res, next) => {
    new OK({
      message: 'Lấy danh sách danh mục công khai thành công',
      metadata: await CategoryService.getAllCategoriesPublish(req.query),
    }).send(res);
  };

  getAllCategoriesDraff = async (req, res, next) => {
    new OK({
      message: 'Lấy danh sách danh mục nháp thành công',
      metadata: await CategoryService.getAllCategoriesDraff(req.query),
    }).send(res);
  };

  getListSearchCategory = async (req, res, next) => {
    new OK({
      message: 'Lấy danh sách danh mục tìm kiếm thành công',
      metadata: await CategoryService.searchCategory(req.params),
    }).send(res);
  };
}

module.exports = new CategoryController();
