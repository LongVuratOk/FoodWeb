'use strict';

const { OK } = require('../core/success.response');
const PaymentService = require('../services/payment.service');

class PaymentController {
  constructor() {
    this.paymentService = new PaymentService();
  }

  createPayment = async (req, res, next) => {
    new OK({
      message: 'Thanh toán ....',
      metadata: await this.paymentService.createPayment(req.body),
    }).send(res);
  };

  callback = async (req, res, next) => {
    new OK({
      message: 'Thanh toán thành công',
      metadata: await this.paymentService.callback(req.query),
    }).send(res);
  };

  notify = async (req, res, next) => {
    new OK({
      message: 'Thanh toán thành công',
      metadata: await this.paymentService.notifyHandler(req.body),
    }).send(res);
  };
}

module.exports = new PaymentController();
