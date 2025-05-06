'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const {
  findDiscountByCode,
  findAllDiscountCodeUnSeletect,
  deleteDiscountCodeId,
  findOneAndUpdateDiscount,
  findByDiscountId,
} = require('../models/repositories/discount.repo');
const { validateCreateDiscount } = require('../validations/discount.valid');
const {
  convertToObjectIdMongodb,
  getSelectData,
  getUnSelectData,
} = require('../utils/index');
const PAGINATE_OPTIONS = require('../constants/type.paginate');
const {
  findAllProductForDiscount,
} = require('../models/repositories/product.repo');
const DiscountRepository = require('../models/repositories/discount.repo');
const ProductRepository = require('../models/repositories/product.repo');

class DiscountService {
  constructor() {
    this.discountRepository = new DiscountRepository();
    this.productRepository = new ProductRepository();
  }

  async createDiscount(data) {
    const { error } = validateCreateDiscount(data);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const {
      name,
      description,
      type,
      value,
      max_value,
      code,
      start_date,
      end_date,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
      min_order_value,
      createBy,
      is_active,
      applies_to,
      product_ids,
    } = data;

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Thời gian sử dụng mã giảm giá không hợp lệ');
    }

    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError('Ngày bắt đầu phải nhỏ hơn ngày hết hạn');
    }

    const discountExist = await this.discountRepository.findOne({
      discount_code: code,
    });
    if (discountExist && discountExist.discount_is_active) {
      throw new BadRequestError('Mã giảm giá đã tồn tại');
    }

    const bodyCreate = {
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_createBy: convertToObjectIdMongodb(createBy),
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    };

    const newDiscount = await this.discountRepository.create(bodyCreate);
    return newDiscount;
  }

  async updateDiscount() {}

  async getAllDiscountsCodeWithProducts({
    code,
    limit = PAGINATE_OPTIONS.LIMIT,
    page = PAGINATE_OPTIONS.PAGE,
  }) {
    const discountExist = await this.discountRepository.findOne({
      discount_code: code,
    });
    if (!discountExist || !discountExist.discount_is_active) {
      throw new NotFoundError('Mã giảm giá không tồn tại');
    }

    const { discount_applies_to, discount_product_ids } = discountExist;
    let products;

    const query = {
      limit,
      page,
      fieldSelect: getSelectData(['product_name']),
    };

    products = await this.findAllProductForDiscount(
      discount_applies_to,
      query,
      discount_product_ids,
    );

    if (!products) {
      throw new BadRequestError('Sản phẩm không tồn tại');
    }
    return products;
  }

  findAllProductForDiscount(discount_applies_to, query, discount_product_ids) {
    const filter = { isPublished: true };
    const { limit, page, fieldSelect } = query;
    if (discount_applies_to === 'specific') {
      filter._id = { $in: discount_product_ids };
    }
    return this.productRepository.query(filter, limit, page, fieldSelect);
  }

  async getAllDiscount({
    limit = PAGINATE_OPTIONS.LIMIT,
    page = PAGINATE_OPTIONS.PAGE,
    sort = PAGINATE_OPTIONS.SORT,
    filter = {},
  }) {
    filter = { discount_is_active: true };
    const fieldSelect = getUnSelectData(['__v']);
    const discount = await this.discountRepository.findAllDiscountCode({
      filter,
      limit,
      page,
      sort,
      fieldSelect,
    });
    if (!discount) {
      throw new NotFoundError('Mã giảm giá không tồn tại');
    }

    return discount;
  }

  async deleteDiscountCodeId({ discountId }) {
    const deleteDiscount = await this.discountRepository.deleteOne({
      _id: convertToObjectIdMongodb(discountId),
    });
    if (!deleteDiscount.deletedCount) {
      throw new NotFoundError('Mã giảm giá không tồn tại');
    }
    return deleteDiscount;
  }

  async getDiscountAmount({ code, userId, products }) {
    const discountExist = await this.discountRepository.findOne({
      discount_code: code,
    });
    if (!discountExist) {
      throw new NotFoundError('Mã giảm giá không tồn tại');
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value,
      discount_max_value,
    } = discountExist;

    if (!discount_is_active) {
      throw new BadRequestError('Mã giảm giá đã hết hạn');
    }
    if (!discount_max_uses) {
      throw new BadRequestError('Mã giảm giá đã sử dụng hết');
    }
    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError('Thời gian sử dụng mã giảm giá không hợp lệ');
    }

    let totalOrder = 0;
    if (discount_min_order_value >= 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      if (discount_min_order_value > totalOrder) {
        throw new BadRequestError(
          'Yêu cầu giá trị sản phẩm phải lớn giá trị tối thiểu',
          discount_min_order_value,
        );
      }

      if (discount_max_uses_per_user > 0) {
        const userDiscountUsed = discount_users_used.find(
          (user) => user.userId === userId,
        );

        const usedCount = userDiscountUsed ? userDiscountUsed.count : 0;
        if (usedCount >= discount_max_uses_per_user) {
          throw new BadRequestError('Bạn đã đạt giới hạn để sử dụng');
        }

        let amount =
          discount_type === 'fixed_amount'
            ? discount_value
            : totalOrder * (discount_value / 100);
        if (discount_max_value && discount_max_value < amount) {
          amount = discount_max_value;
        }

        return {
          totalOrder,
          discount: amount,
          totalOrder: totalOrder - amount,
        };
      }
    }
  }

  async addUserForDiscount({ code, userId }) {
    const discountExist = await this.discountRepository.findOne({
      discount_code: code,
    });
    if (!discountExist) {
      throw new NotFoundError('Mã giảm giá không tìm thấy');
    }

    const userIndex = discountExist.discount_users_used.findIndex(
      (user) => user.userId === userId,
    );

    if (userIndex === -1) {
      discountExist.discount_users_used.push({ userId, count: 1 });
    } else {
      if (
        discountExist.discount_max_uses_per_user > 0 &&
        discountExist.discount_users_used[userIndex].count >=
          discountExist.discount_max_uses_per_user
      ) {
        throw new BadRequestError('Bạn đã đạt giới hạn sử dụng mã giảm giá');
      }
      discountExist.discount_users_used[userIndex].count += 1;
    }

    discountExist.discount_uses_count += 1;
    discountExist.discount_max_uses -= 1;

    const query = { discount_code: code },
      bodyUpdate = {
        $set: {
          discount_users_used: discountExist.discount_users_used,
          discount_uses_count: discountExist.discount_uses_count,
          discount_max_uses: discountExist.discount_max_uses,
        },
      },
      options = { new: true };
    const result = await this.discountRepository.updateOne(
      query,
      bodyUpdate,
      options,
    );
    if (!result.modifiedCount) {
      throw new NotFoundError('Không tìm thấy mã giảm giá');
    }
    return {};
  }

  async cancelDiscountCode({ discountId, userId }) {
    const discountExist = await this.discountRepository.findById(discountId);
    if (!discountExist) {
      throw new NotFoundError('Không tìm thấy mã giảm giá');
    }

    const userFound = discountExist.discount_users_used.find(
      (user) => user.userId === userId,
    );
    if (!userFound) {
      throw new NotFoundError('Không tìm thấy người dùng');
    }

    if (userFound.count <= 0) {
      throw new BadRequestError('Người dùng chưa sử dụng mã giảm giá');
    }
    const query = { _id: discountId, 'discount_users_used.userId': userId };
    let bodyUpdate;

    if (userFound.count === 1) {
      bodyUpdate = {
        $inc: {
          discount_max_uses: 1,
          discount_uses_count: -1,
        },
        $pull: {
          discount_users_used: { userId },
        },
      };
    } else {
      bodyUpdate = {
        $inc: {
          discount_max_uses: 1,
          discount_uses_count: -1,
          'discount_users_used.$.count': -1,
        },
      };
    }
    const options = { new: true };

    const result = await this.discountRepository.updateOne(
      query,
      bodyUpdate,
      options,
    );
    if (!result.modifiedCount) {
      throw new NotFoundError('Không tìm thấy mã giảm giá');
    }
    return {};
  }
}

module.exports = DiscountService;
