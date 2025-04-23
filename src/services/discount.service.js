'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const {
  findDiscountByCode,
  createDiscount,
  findAllDiscountCodeUnSeletect,
  deleteDiscountCodeId,
  findOneAndUpdateDiscount,
  findByDiscountId,
} = require('../models/repositories/discount.repo');
const { validateCreateDiscount } = require('../validations/discount.valid');
const { convertToObjectIdMongodb } = require('../utils/index');
const {
  findAllProductForDiscount,
} = require('../models/repositories/product.repo');

class DiscountService {
  static createDiscount = async (data) => {
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

    const discountFound = await findDiscountByCode({ discount_code: code });
    if (discountFound && discountFound.discount_is_active) {
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

    const newDiscount = await createDiscount(bodyCreate);
    return newDiscount;
  };

  static updateDiscount = async () => {};

  static getAllDiscountsCodeWithProducts = async ({
    code,
    limit = 50,
    page = 1,
    sort = 'ctime',
  }) => {
    const discountFound = await findDiscountByCode({ discount_code: code });
    if (!discountFound || !discountFound.discount_is_active) {
      throw new NotFoundError('Mã giảm giá không tồn tại');
    }

    const { discount_applies_to, discount_product_ids } = discountFound;
    let products;
    if (discount_applies_to === 'all') {
      products = await findAllProductForDiscount({
        limit,
        sort,
        page,
        filter: { isPublished: true },
        select: ['product_name'],
      });
    }

    if (discount_applies_to === 'specific') {
      products = await findAllProductForDiscount({
        limit,
        sort,
        page,
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        select: ['product_name'],
      });
    }
    if (!products) {
      throw new BadRequestError('Sản phẩm không tồn tại');
    }
    return products;
  };

  static getAllDiscount = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter = {},
  }) => {
    filter = { discount_is_active: true };
    const discount = await findAllDiscountCodeUnSeletect({
      filter,
      limit,
      page,
      sort,
      unSelect: ['__v'],
    });
    if (!discount) {
      throw new NotFoundError('Mã giảm giá không tồn tại');
    }

    return discount;
  };

  static deleteDiscountCodeId = async ({ discountId }) => {
    const deleteDiscount = await deleteDiscountCodeId(discountId);
    if (!deleteDiscount) {
      throw new NotFoundError('Mã giảm giá không tồn tại');
    }
    return deleteDiscount;
  };

  static getDiscountAmount = async ({ code, userId, products }) => {
    const discountFound = await findDiscountByCode({
      discount_code: code,
    });
    if (!discountFound) {
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
    } = discountFound;

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
  };

  static addUserForDiscount = async ({ code, userId }) => {
    const discountFound = await findDiscountByCode({ discount_code: code });
    if (!discountFound) {
      throw new NotFoundError('Mã giảm giá không tìm thấy');
    }

    const userIndex = discountFound.discount_users_used.findIndex(
      (user) => user.userId === userId,
    );

    if (userIndex === -1) {
      discountFound.discount_users_used.push({ userId, count: 1 });
    } else {
      if (
        discountFound.discount_max_uses_per_user > 0 &&
        discountFound.discount_users_used[userIndex].count >=
          discountFound.discount_max_uses_per_user
      ) {
        throw new BadRequestError('Bạn đã đạt giới hạn sử dụng mã giảm giá');
      }
      discountFound.discount_users_used[userIndex].count += 1;
    }

    discountFound.discount_uses_count += 1;
    discountFound.discount_max_uses -= 1;

    const query = { discount_code: code },
      bodyUpdate = {
        $set: {
          discount_users_used: discountFound.discount_users_used,
          discount_uses_count: discountFound.discount_uses_count,
          discount_max_uses: discountFound.discount_max_uses,
        },
      },
      options = { new: true };
    const result = await findOneAndUpdateDiscount(query, bodyUpdate, options);
    if (!result) {
      throw new NotFoundError('Không tìm thấy mã giảm giá');
    }
    return {};
  };

  static async cancelDiscountCode({ discountId, userId }) {
    const discountFound = await findByDiscountId(discountId);
    if (!discountFound) {
      throw new NotFoundError('Không tìm thấy mã giảm giá');
    }

    const userFound = discountFound.discount_users_used.find(
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

    const result = await findOneAndUpdateDiscount(query, bodyUpdate, options);
    if (!result) {
      throw new NotFoundError('Không tìm thấy mã giảm giá');
    }
    return {};
  }
}

module.exports = DiscountService;
