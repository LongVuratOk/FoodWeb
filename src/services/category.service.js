'use strict';

const {
  validateCreateCategory,
  validateUpdateCategory,
} = require('../validations/category.valid');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const {
  createCategory,
  findByCategoryName,
  publishCategory,
  unPublishCategory,
  queryCategory,
  searchCategory,
  findByCategoryId,
  updateCategory,
  deleteCategory,
} = require('../models/repositories/category.repo');
const { getInfoData } = require('../utils');

class CategoryService {
  static searchCategory = async ({ keySearch }) => {
    return searchCategory({ keySearch });
  };

  static getAllCategoriesDraff = async ({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isDraff: true },
  }) => {
    return await queryCategory({
      limit,
      sort,
      page,
      filter,
    });
  };

  static getAllCategoriesPublish = async ({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
  }) => {
    return await queryCategory({
      limit,
      sort,
      page,
      filter,
    });
  };

  static getAllCategories = async ({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = {},
  }) => {
    return await queryCategory({
      limit,
      sort,
      page,
      filter,
    });
  };

  static publishCategory = async ({ category_id }) => {
    return await publishCategory(category_id);
  };

  static unPublishCategory = async ({ category_id }) => {
    return await unPublishCategory(category_id);
  };

  static createCategory = async (body) => {
    // valid data
    const { error } = validateCreateCategory(body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // check category is exists
    const foundCategory = await findByCategoryName(body.category_name);
    if (foundCategory) {
      throw new BadRequestError('Category is exists');
    }

    const newCategory = await createCategory(body);
    return {
      category: getInfoData({ fields: ['category_name'], object: newCategory }),
    };
  };

  static updateCategory = async ({ category_id, bodyUpdate }) => {
    const { error } = validateUpdateCategory(bodyUpdate);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    return await updateCategory({ id: category_id, bodyUpdate });
  };
  static deleteCategory = async ({ category_id }) => {
    return await deleteCategory(category_id);
  };
}

module.exports = CategoryService;
