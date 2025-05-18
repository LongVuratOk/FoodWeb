'use strict';

const OrderModel = require('../order.model');
const BaseRepository = require('./base.repo');

class OrderRepository extends BaseRepository {
  constructor() {
    super(OrderModel);
  }
  updateOrderStatus(orderId) {
    return this.getModel().findByIdAndUpdate(
      orderId,
      { payment_method: 'online', is_payment: true },
      { new: true },
    );
  }
}

module.exports = OrderRepository;
