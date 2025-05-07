'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const {
  validateCreateOrder,
  validateUpdateOrder,
} = require('../validations/order.valid');
const OrderRepository = require('../models/repositories/order.repo');

class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
  }
  async createOrder(order) {
    const { error } = validateCreateOrder(order);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const newOrder = await this.orderRepository.create(order);

    return newOrder;
  }

  async updateOrderStatus({ orderId, status }) {
    const { error } = validateUpdateOrder({ status });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }
    const order = await this.orderRepository.updateOne(
      { _id: orderId },
      { status },
    );
    if (!order.modifiedCount) {
      throw new NotFoundError('Không tìm thấy đơn hàng');
    }
    return order;
  }
}

module.exports = OrderService;
