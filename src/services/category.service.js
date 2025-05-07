'use strict';

const {
  validateCreateCategory,
  validateUpdateCategory,
} = require('../validations/category.valid');
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
} = require('../core/error.response');
const { convertToObjectIdMongodb } = require('../utils');
const CategoryRepository = require('../models/repositories/category.repo');
const PAGINATE_OPTIONS = require('../constants/type.paginate');

class CategoryService {
  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  async publishCategory({ category_id }) {
    const result = await this.categoryRepo.publishCategory(category_id);
    if (!result) {
      throw new NotFoundError('Danh mục không tồn tại');
    }
    return result;
  }

  async unPublishCategory({ category_id }) {
    const result = await this.categoryRepo.unPublishCategory(category_id);
    if (!result) {
      throw new NotFoundError('Danh mục không tồn tại');
    }
    return result;
  }

  /**
   * Tạo mới một danh mục:
   * - Xác thực dữ liệu đầu vào
   * - Kiểm tra danh mục tồn tại
   * - Tạo danh mục mới
   */
  async createCategory(body) {
    const { error } = validateCreateCategory(body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const { category_name } = body;
    const productExist = await this.categoryRepo.findOne({
      category_name: { $regex: `^${category_name}$`, $options: 'i' },
    });
    if (productExist) {
      throw new ConflictError('Danh mục đã tồn tại');
    }

    const newCategory = await this.categoryRepo.create(body);
    return newCategory;
  }

  async updateCategory({ category_id, bodyUpdate }) {
    const { error } = validateUpdateCategory(bodyUpdate);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (bodyUpdate.category_name) {
      const categoryExist = await this.categoryRepo.findOne({
        category_name: bodyUpdate.category_name,
      });
      if (categoryExist) {
        throw new ConflictError('Danh mục đã tồn tại');
      }
    }

    const updateCat = await this.categoryRepo.updateOne(
      { _id: convertToObjectIdMongodb(category_id) },
      bodyUpdate,
    );
    if (!updateCat.modifiedCount) {
      throw new NotFoundError('Danh mục không tồn tại');
    }

    return updateCat;
  }

  async deleteCategory({ category_id }) {
    const deleteCat = await this.categoryRepo.deleteOne({
      _id: convertToObjectIdMongodb(category_id),
    });
    if (!deleteCat.deletedCount) {
      throw new NotFoundError('Danh mục không tồn tại');
    }

    return deleteCat;
  }

  async getAllCategories(query) {
    return await this.queryCategories({ query });
  }

  async searchCategory({ keySearch }) {
    return await this.categoryRepo.searchCategory({ keySearch });
  }

  async getAllCategoriesDraff(query) {
    return await this.queryCategories({ filter: { isDraff: true }, query });
  }

  async getAllCategoriesPublish(query) {
    return await this.queryCategories({ filter: { isPublished: true }, query });
  }

  async queryCategories({ filter, query }) {
    const limit = parseInt(query.limit) || PAGINATE_OPTIONS.LIMIT;
    const page = parseInt(query.page) || PAGINATE_OPTIONS.PAGE;
    const keySearch = query.keySearch || null;
    const order = query.order || 'desc';
    const sortBy = query.sortBy || 'createdAt';
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

    if (page < 1) {
      throw new BadRequestError('Số trang không hợp lệ');
    }

    const result = await this.categoryRepo.queryCategory({
      keySearch,
      filter,
      limit,
      skip,
      sort,
    });
    //const total = await this.categoryRepo.countDoc(filter);
    const total = result.length;
    const totalPage = Math.ceil(total / limit);
    return {
      data: result,
      total,
      limit,
      page,
      totalPage,
    };
  }
}

module.exports = CategoryService;
