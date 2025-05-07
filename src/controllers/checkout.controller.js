'use strict';

const { OK } = require('../core/success.response');
const CheckoutService = require('../services/checkout.service');

class CheckoutController {
  constructor() {
    this.checkoutService = new CheckoutService();
  }
  checkoutReview = async (req, res, next) => {
    new OK({
      message: 'OK',
      metadata: await this.checkoutService.checkoutReview({
        userId: req.user.userId,
        order_products: req.body,
      }),
    }).send(res);
  };
}

module.exports = new CheckoutController();
