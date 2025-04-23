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
  // Tìm liếm danh mục theo từ khóa
  static searchCategory = async ({ keySearch }) => {
    return await searchCategory({ keySearch });
  };

  // Lấy bản nháp của danh mục
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

  // Lấy bản công khai của danh mục
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

  // Lấy tất cả danh mục
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

  // Chuyển danh mục sang trạng thái công khai
  static publishCategory = async ({ category_id }) => {
    const result = await publishCategory(category_id);
    if (!result) {
      throw new NotFoundError('Danh mục không tồn tại');
    }
    return result;
  };

  // Chuyển danh mục sang trạng thái nháp
  static unPublishCategory = async ({ category_id }) => {
    const result = await unPublishCategory(category_id);
    if (!result) {
      throw new NotFoundError('Danh mục không tồn tại');
    }
    return result;
  };

  /**
   * Tạo mới một danh mục:
   * - Xác thực dữ liệu đầu vào
   * - Kiểm tra danh mục tồn tại
   * - Tạo danh mục mới
   */
  static createCategory = async (body) => {
    const { error } = validateCreateCategory(body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const foundCategory = await findByCategoryName(body.category_name);
    if (foundCategory) {
      throw new BadRequestError('Danh mục không tồn tại');
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

    const updateCat = await updateCategory({ id: category_id, bodyUpdate });
    if (!updateCat) {
      throw new NotFoundError('Danh mục không tồn tại');
    }

    return updateCat;
  };

  /**
   * Xóa danh mục
   * - Xóa các sản phẩm liên quan đến danh mục hiện tại
   * - Xóa danh mục
   */
  static deleteCategory = async ({ category_id }) => {
    const deleteCat = await deleteCategory(category_id);
    if (!deleteCat.deleteCat) {
      throw new NotFoundError('Danh mục không tồn tại');
    }

    return deleteCat;
  };
}

module.exports = CategoryService;
