'use strict';

const { OK } = require('../../core/success.response');
const CheckoutService = require('../../services/checkout.service');

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new OK({
      message: 'OK',
      metadata: await CheckoutService.checkoutReview({
        userId: req.user.userId,
        order_products: req.body,
      }),
    }).send(res);
  };
}

module.exports = new CheckoutController();
