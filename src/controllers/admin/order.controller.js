'use strict';

const OrderService = require('../../services/order.service');
const { OK } = require('../../core/success.response');

class OrderController {
  createOrder = async (req, res, next) => {
    new OK({
      message: 'Tạo đơn hàng thành công',
      metadata: await OrderService.createOrder(req.body),
    }).send(res);
  };

  createPayment = async (req, res, next) => {
    new OK({
      message: 'Thanh toán ....',
      metadata: await OrderService.createPayment(req.body),
    }).send(res);
  };

  callback = async (req, res, next) => {
    new OK({
      message: 'Thanh toán thành công',
      metadata: await OrderService.callback(req.query),
    }).send(res);
  };

  notify = async (req, res, next) => {
    new OK({
      message: 'Thanh toán thành công',
      metadata: await OrderService.notifyHandler(req.body),
    }).send(res);
  };
}

module.exports = new OrderController();
