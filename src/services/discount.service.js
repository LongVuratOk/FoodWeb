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
      throw new BadRequestError('Discount code has expired');
    }

    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError('start date must be less than end date');
    }

    const discountFound = await findDiscountByCode({ discount_code: code });
    if (discountFound && discountFound.discount_is_active) {
      throw new BadRequestError('Discount code already exists');
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

  // update discount
  static updateDiscount = async () => {};

  static getAllDiscountsCodeWithProducts = async ({
    code,
    limit = 50,
    page = 1,
    sort = 'ctime',
  }) => {
    const discountFound = await findDiscountByCode({ discount_code: code });
    if (!discountFound || !discountFound.discount_is_active) {
      throw new NotFoundError('Discount is not exists');
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
      throw new BadRequestError('Product is not exists');
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
      throw new NotFoundError('Discount is not exists');
    }

    return discount;
  };

  static deleteDiscountCodeId = async ({ discountId }) => {
    const deleteDiscount = await deleteDiscountCodeId(discountId);
    if (!deleteDiscount) {
      throw new NotFoundError('Discount is not exists');
    }
    return deleteDiscount;
  };

  static getDiscountAmount = async ({ code, userId, products }) => {
    const discountFound = await findDiscountByCode({
      discount_code: code,
    });
    if (!discountFound) {
      throw new NotFoundError('Discount is not found');
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
      throw new BadRequestError('Discount code has expired');
    }
    if (!discount_max_uses) {
      throw new BadRequestError('Discount are out');
    }
    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError('Discount code has expired');
    }

    // check minium cart value
    let totalOrder = 0;
    if (discount_min_order_value >= 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      if (discount_min_order_value > totalOrder) {
        throw new BadRequestError(
          'discount requires a minium order value of ',
          discount_min_order_value,
        );
      }

      if (discount_max_uses_per_user > 0) {
        const userDiscountUsed = discount_users_used.find(
          (user) => user.userId === userId,
        );

        const usedCount = userDiscountUsed ? userDiscountUsed.count : 0;
        if (usedCount >= discount_max_uses_per_user) {
          throw new BadRequestError('user discount limit');
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
      throw new NotFoundError('Discount is not found');
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
        throw new BadRequestError('User has used maximum for discount');
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
      throw new NotFoundError('Discount is not found');
    }
    return {};
  };

  static async cancelDiscountCode({ discountId, userId }) {
    const discountFound = await findByDiscountId(discountId);
    if (!discountFound) {
      throw new NotFoundError('Discount is not found');
    }

    const userFound = discountFound.discount_users_used.find(
      (user) => user.userId === userId,
    );
    if (!userFound) {
      throw new NotFoundError('User is not found');
    }

    if (userFound.count <= 0) {
      throw new BadRequestError('User has no usage to cancel');
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
      throw new NotFoundError('Discount is not found');
    }
    return {};
  }
}

module.exports = DiscountService;
