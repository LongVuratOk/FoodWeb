'use strict';

const OrderService = require('../services/order.service');
const { OK } = require('../core/success.response');

class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }
  createOrder = async (req, res, next) => {
    new OK({
      message: 'Tạo đơn hàng thành công',
      metadata: await this.orderService.createOrder(req.body),
    }).send(res);
  };

  updateOrderStatus = async (req, res, next) => {
    new OK({
      message: 'Cập nhật trạng thái đơn hàng thành công',
      metadata: await this.orderService.updateOrderStatus({
        orderId: req.params._id,
        status: req.body.status,
      }),
    }).send(res);
  };
}

module.exports = new OrderController();
