'use strict';

const express = require('express');
const router = express.Router();

const { asyncHandle } = require('../../middlewares/asyncHandle.middleware');
const { authentication } = require('../../auth/authentication');
const CheckoutController = require('../../controllers/checkout.controller');

router.use(authentication);

router.post(
  '/checkout-reviews',
  asyncHandle(CheckoutController.checkoutReview),
);

module.exports = router;
