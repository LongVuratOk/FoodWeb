'use strict';

const OrderModel = require('../order.model');

const createOrder = async (order) => {
  return await OrderModel.create(order);
};

const updateOrderStatus = async (orderId) => {
  return await OrderModel.findByIdAndUpdate(
    orderId,
    { is_payment: true },
    { new: true },
  );
};

module.exports = {
  createOrder,
  updateOrderStatus,
};
