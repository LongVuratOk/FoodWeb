'use strict';

const express = require('express');
const { authentication } = require('../../auth/authentication');
const { asyncHandle } = require('../../middlewares/asyncHandle.middleware');
const DiscountController = require('../../controllers/admin/discount.controller');
const router = express.Router();

router.use(authentication);

router.get('/', asyncHandle(DiscountController.getAllDiscountCode));
router.post('/create', asyncHandle(DiscountController.createDiscount));
router.post('/amount', asyncHandle(DiscountController.getDiscountAmount));
router.post('/add/:code', asyncHandle(DiscountController.addUserForDiscount));
router.post('/cancel/:_id', asyncHandle(DiscountController.getCancelDiscount));
router.get(
  '/:code',
  asyncHandle(DiscountController.getAllDiscountCodeWithProducts),
);

router.delete('/:_id', asyncHandle(DiscountController.deleteDiscountCodeId));
module.exports = router;
