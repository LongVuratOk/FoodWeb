'use strict';

const { NotFoundError, BadRequestError } = require('../core/error.response');
const {
  findByCartId,
  findByUserIdCart,
} = require('../models/repositories/cart.repo');
const { checkProductByServer } = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');

class CheckoutService {
  /**
   * Kiểm tra đơn hàng trước khi thanh toán
   * - Kiểm tra sản phẩm
   * - Tính tổng tiền của các sản phẩm
   * - Kiểm tra và áp dụng mã giảm giá
   * - Tính tổng tiền thanh toán
   */
  static checkoutReview = async ({ userId, order_products }) => {
    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };

    const { code, products } = order_products;
    const cartId = await findByUserIdCart(userId);
    console.log('cartId');

    const checkProductServer = await checkProductByServer(cartId.cart_products);
    console.log('checkProductServer', checkProductServer);
    if (!checkProductServer[0]) {
      throw new BadRequestError('Sản phẩm không tồn tại hoặc đã hết hàng');
    }

    const checkoutPrice = checkProductServer.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);
    checkout_order.totalPrice = checkoutPrice;

    const itemCheckout = {
      priceRaw: checkoutPrice,
      priceApplyDiscount: checkoutPrice,
      products: checkProductServer,
    };

    if (code) {
      const { totalOrder, discount } = await getDiscountAmount({
        code,
        userId,
        products: checkProductServer,
      });

      checkout_order.totalDiscount += discount;
      if (discount > 0) {
        itemCheckout.priceApplyDiscount = checkoutPrice - discount;
      }
    }
    checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
    if (checkout_order.feeShip > 0) {
      checkout_order.totalCheckout += checkout_order.feeShip;
    }
    return {
      checkout_order,
    };
  };

  static order = async ({}) => {};
}

module.exports = CheckoutService;
