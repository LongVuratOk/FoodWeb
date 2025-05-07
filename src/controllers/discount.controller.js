'use strict';

const { CREATED, OK } = require('../core/success.response');
const DiscountService = require('../services/discount.service');

class DiscountController {
  constructor() {
    this.discountService = new DiscountService();
  }
  createDiscount = async (req, res, next) => {
    new CREATED({
      message: 'Tạo mã giảm giá thành công',
      metadata: await this.discountService.createDiscount({
        ...req.body,
        createBy: req.user.userId,
      }),
    }).send(res);
  };

  deleteDiscountCodeId = async (req, res, next) => {
    new OK({
      message: 'Xóa mã giảm giá thành công',
      metadata: await this.discountService.deleteDiscountCodeId({
        discountId: req.params._id,
      }),
    }).send(res);
  };

  getAllDiscountCode = async (req, res, next) => {
    new OK({
      message: 'Lấy danh sách mã giảm giá thành công',
      metadata: await this.discountService.getAllDiscount(req.query),
    }).send(res);
  };

  getAllDiscountCodeWithProducts = async (req, res, next) => {
    new OK({
      message: 'Lấy danh sách sản phẩm được áp dụng mã giảm giá thành công',
      metadata: await this.discountService.getAllDiscountsCodeWithProducts({
        ...req.query,
        code: req.params.code,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new OK({
      message: 'Áp dụng mã giảm giá thành công',
      metadata: await this.discountService.getDiscountAmount({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  addUserForDiscount = async (req, res, next) => {
    new OK({
      message: 'OK',
      metadata: await this.discountService.addUserForDiscount({
        code: req.params.code,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  getCancelDiscount = async (req, res, next) => {
    new OK({
      message: 'Hủy bỏ sử dụng mã giảm giá thành công',
      metadata: await this.discountService.cancelDiscountCode({
        discountId: req.params._id,
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
