'use strict';

const { CREATED, OK } = require('../../core/success.response');
const DiscountService = require('../../services/discount.service');

class DiscountController {
  createDiscount = async (req, res, next) => {
    new CREATED({
      message: 'Tạo mã giảm giá thành công',
      metadata: await DiscountService.createDiscount({
        ...req.body,
        createBy: req.user.userId,
      }),
    }).send(res);
  };

  deleteDiscountCodeId = async (req, res, next) => {
    new OK({
      message: 'Xóa mã giảm giá thành công',
      metadata: await DiscountService.deleteDiscountCodeId({
        discountId: req.params._id,
      }),
    }).send(res);
  };

  getAllDiscountCode = async (req, res, next) => {
    new OK({
      message: 'Lấy danh sách mã giảm giá thành công',
      metadata: await DiscountService.getAllDiscount(req.query),
    }).send(res);
  };

  getAllDiscountCodeWithProducts = async (req, res, next) => {
    new OK({
      message: 'Lấy danh sách sản phẩm được áp dụng mã giảm giá thành công',
      metadata: await DiscountService.getAllDiscountsCodeWithProducts({
        ...req.query,
        code: req.params.code,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new OK({
      message: 'Áp dụng mã giảm giá thành công',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  addUserForDiscount = async (req, res, next) => {
    new OK({
      message: 'OK',
      metadata: await DiscountService.addUserForDiscount({
        code: req.params.code,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  getCancelDiscount = async (req, res, next) => {
    new OK({
      message: 'Hủy bỏ sử dụng mã giảm giá thành công',
      metadata: await DiscountService.cancelDiscountCode({
        discountId: req.params._id,
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
