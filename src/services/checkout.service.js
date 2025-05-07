'use strict';

const { BadRequestError } = require('../core/error.response');
const CartRepository = require('../models/repositories/cart.repo');
const ProductRepository = require('../models/repositories/product.repo');
const { checkProductByServer } = require('../models/repositories/product.repo');
const DiscountService = require('./discount.service');
const { getDiscountAmount } = require('./discount.service');

class CheckoutService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  /**
   * Kiểm tra đơn hàng trước khi thanh toán
   * - Kiểm tra sản phẩm
   * - Tính tổng tiền của các sản phẩm
   * - Kiểm tra và áp dụng mã giảm giá
   * - Tính tổng tiền thanh toán
   */
  async checkoutReview({ userId, order_products }) {
    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };

    const { code, products } = order_products;
    const cartId = await this.cartRepository.findByUserIdCart(userId);

    const checkProductServer = await this.productRepository.getProductForCart(
      cartId.cart_products,
    );
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
      const discountService = new DiscountService();
      const { totalOrder, discount } = await discountService.getDiscountAmount({
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
  }
}

module.exports = CheckoutService;
