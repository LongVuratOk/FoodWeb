'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const CategoryRepository = require('../models/repositories/category.repo');
const ProductRepository = require('../models/repositories/product.repo');
const { convertToObjectIdMongodb } = require('../utils');
const {
  validateCreateProduct,
  validateUpdateProduct,
} = require('../validations/product.valid');
const PAGINATE_OPTIONS = require('../constants/type.paginate');

class ProductService {
  constructor() {
    this.productRepo = new ProductRepository();
    this.categoryRepo = CategoryRepository;
  }

  async createProduct(body) {
    const { error } = validateCreateProduct(body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const categoryExist = await this.categoryRepo.findOne({
      _id: convertToObjectIdMongodb(body.product_category),
    });
    if (!categoryExist) {
      throw new NotFoundError('Không tìm thấy danh mục');
    }

    return await this.productRepo.create(body);
  }

  async updateProduct(productId, bodyUpdate) {
    const { error } = validateUpdateProduct(bodyUpdate);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    if (bodyUpdate.product_category) {
      const categoryExist = await this.categoryRepo.findOne({
        _id: convertToObjectIdMongodb(bodyUpdate.product_category),
      });
      if (!categoryExist) {
        throw new NotFoundError('Không tìm thấy danh mục');
      }
    }

    const updatedPro = await this.productRepo.updateOne(
      { _id: convertToObjectIdMongodb(productId) },
      bodyUpdate,
    );
    if (!updatedPro) {
      throw new NotFoundError('Không tìm thấy sản phẩm');
    }

    return updatedPro;
  }

  async deleteProduct(productId) {
    const deleted = await this.productRepo.deleteOne({
      _id: convertToObjectIdMongodb(productId),
    });
    if (!deleted) {
      throw new NotFoundError('Không tìm thấy sản phẩm');
    }

    return deleted;
  }

  async getAllProducts(query) {
    const { category, priceFrom, priceTo, rating } = query;
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
    return await this.queryProducts({ filter, query });
  }

  async getAllProductsDraff(query) {
    return await this.queryProducts({ filter: { isDraff: true }, query });
  }

  async getAllProductsPublished(query) {
    return await this.queryProducts({ filter: { isPublished: true }, query });
  }

  async getProduct({ product_id }) {
    const result = await this.productRepo.findById(product_id);
    if (!result) {
      throw new NotFoundError('Không tìm thấy sản phẩm');
    }

    return result;
  }

  async searchProduct({ keySearch }) {
    return await this.productRepo.searchProduct({ keySearch });
  }

  async publishedProduct({ product_id }) {
    const result = await this.productRepo.publishProduct(product_id);
    if (!result) {
      throw new NotFoundError('Không tìm thấy sản phẩm');
    }

    return result;
  }

  async unPublishedProduct({ product_id }) {
    const result = await this.productRepo.unPublishProduct(product_id);
    if (!result) {
      throw new NotFoundError('Không tìm thấy sản phẩm');
    }

    return result;
  }

  async queryProducts({ filter = {}, query }) {
    const limit = parseInt(query.limit) || PAGINATE_OPTIONS.LIMIT;
    const page = parseInt(query.page) || PAGINATE_OPTIONS.PAGE;
    const keySearch = query.keySearch || null;
    const order = query.order || PAGINATE_OPTIONS.SORT;
    const sortBy = query.sortBy || 'createdAt';
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === 'ctime' ? -1 : 1 };

    if (page < 1) {
      throw new BadRequestError('Số trang không hợp lệ');
    }

    const result = await this.productRepo.queryProduct({
      keySearch,
      filter,
      limit,
      skip,
      sort,
    });
    // const countDoc = await this.productRepo.countDoc(filter);
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

module.exports = new ProductService(ProductRepository, CategoryRepository);
