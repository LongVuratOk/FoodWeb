'use strict';

const { default: axios } = require('axios');
const config = require('../configs/momo.config');
const { BadRequestError } = require('../core/error.response');
const { createSignature } = require('../helpers/signature.payment');
const { validateCreateOrder } = require('../validations/order.valid');
const {
  createOrder,
  updateOrderStatus,
} = require('../models/repositories/order.repo');

class OrderService {
  static createOrder = async (order) => {
    const { error } = validateCreateOrder(order);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const newOrder = await createOrder(order);

    return newOrder;
  };
  static createPayment = async (order) => {
    const { orderId, amount } = order;
    if (!orderId || !amount) {
      throw new BadRequestError('Yêu cần phải có mã đơn hàng và giá');
    }
    const requestId = config.partnerCode + new Date().getTime();
    const orderInfo = `Thanh toán đơn hàng ${orderId}`;
    const requestType = 'payWithMethod';
    const extraData = '';
    const orderGroupId = '';
    const autoCapture = true;

    const requestBody = {
      partnerCode: config.partnerCode,
      accessKey: config.accessKey,
      partnerName: 'Test',
      requestId,
      amount: amount.toString(),
      orderId,
      orderInfo,
      redirectUrl: config.redirectUrl,
      ipnUrl: config.ipnUrl,
      lang: 'vi',
      requestType,
      autoCapture,
      extraData,
      orderGroupId: orderGroupId,
    };

    requestBody.signature = createSignature(requestBody, config.secretKey);

    try {
      const response = await axios.post(config.endpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.resultCode === 0) {
        return {
          data: response.data,
        };
      } else {
        throw new BadRequestError(`Lỗi: ${response.data.message}`);
      }
    } catch (error) {
      throw new BadRequestError(`Lỗi: ${error.message}`);
    }
  };

  static callback = async (data) => {
    const { resultCode, orderId, message } = data;
    if (resultCode !== '0') {
      throw new BadRequestError(`Thanh toán thất bại ${message}`);
    }
    return {
      success: `Thanh toán thành công đơn hàng ${orderId}`,
    };
  };

  static notifyHandler = async (data) => {
    const { resultCode, orderId, transId, message } = data;
    if (resultCode === 0) {
      console.log(`Thanh toán thành công: ${orderId}, transId: ${transId}`);
      // TODO: Cập nhật trạng thái đơn hàng trong database
      await updateOrderStatus(orderId);
    } else {
      console.log(`Thanh toán thất bại: ${orderId}, ${message}`);
    }

    return 'OK';
  };
}

module.exports = OrderService;
