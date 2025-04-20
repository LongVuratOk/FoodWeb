'use strict';

const { CREATED, OK } = require('../../core/success.response');
const DiscountService = require('../../services/discount.service');

class DiscountController {
  createDiscount = async (req, res, next) => {
    new CREATED({
      message: 'Create Discount successfully',
      metadata: await DiscountService.createDiscount({
        ...req.body,
        createBy: req.user.userId,
      }),
    }).send(res);
  };

  deleteDiscountCodeId = async (req, res, next) => {
    new OK({
      message: 'Delete discount successfully',
      metadata: await DiscountService.deleteDiscountCodeId({
        discountId: req.params._id,
      }),
    }).send(res);
  };

  getAllDiscountCode = async (req, res, next) => {
    new OK({
      message: 'Get all Discounts successfully',
      metadata: await DiscountService.getAllDiscount(req.query),
    }).send(res);
  };

  getAllDiscountCodeWithProducts = async (req, res, next) => {
    new OK({
      message: 'get all products in Discount successfully',
      metadata: await DiscountService.getAllDiscountsCodeWithProducts({
        ...req.query,
        code: req.params.code,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new OK({
      message: 'get applies discount into cart successfully',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  addUserForDiscount = async (req, res, next) => {
    new OK({
      message: 'Apply discount for product successfully',
      metadata: await DiscountService.addUserForDiscount({
        code: req.params.code,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  getCancelDiscount = async (req, res, next) => {
    new OK({
      message: 'get cancel discount into cart successfully',
      metadata: await DiscountService.cancelDiscountCode({
        discountId: req.params._id,
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
