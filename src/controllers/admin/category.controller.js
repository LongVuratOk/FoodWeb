'use strict';

const { OK, CREATED } = require('../../core/success.response');
const CategoryService = require('../../services/category.service');

class CategoryController {
  pushlishCategory = async (req, res, next) => {
    new OK({
      message: 'Publish category successfully',
      metadata: await CategoryService.publishCategory({
        category_id: req.params._id,
      }),
    }).send(res);
  };

  unPushlishCategory = async (req, res, next) => {
    new OK({
      message: 'unPublish category successfully',
      metadata: await CategoryService.unPublishCategory({
        category_id: req.params._id,
      }),
    }).send(res);
  };

  createCategory = async (req, res, next) => {
    new CREATED({
      message: 'Create category successfully',
      metadata: await CategoryService.createCategory(req.body),
    }).send(res);
  };

  updateCategory = async (req, res, next) => {
    new OK({
      message: 'update category successfully',
      metadata: await CategoryService.updateCategory({
        category_id: req.params._id,
        bodyUpdate: req.body,
      }),
    }).send(res);
  };

  deleteCategory = async (req, res, next) => {
    new OK({
      message: 'delete category successfully',
      metadata: await CategoryService.deleteCategory({
        category_id: req.params._id,
      }),
    }).send(res);
  };

  getAllCategories = async (req, res, next) => {
    new OK({
      message: 'get all categories successfully',
      metadata: await CategoryService.getAllCategories(req.query),
    }).send(res);
  };

  getAllCategoriesPublish = async (req, res, next) => {
    new OK({
      message: 'get all categories publish successfully',
      metadata: await CategoryService.getAllCategoriesPublish(req.query),
    }).send(res);
  };

  getAllCategoriesDraff = async (req, res, next) => {
    new OK({
      message: 'get all categories draff successfully',
      metadata: await CategoryService.getAllCategoriesDraff(req.query),
    }).send(res);
  };

  getListSearchCategory = async (req, res, next) => {
    new OK({
      message: 'get list search success',
      metadata: await CategoryService.searchCategory(req.params),
    }).send(res);
  };
}

module.exports = new CategoryController();
