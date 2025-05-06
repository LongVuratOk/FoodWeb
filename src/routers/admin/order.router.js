'use strict';

const express = require('express');
const OrderController = require('../../controllers/order.controller');
const { asyncHandle } = require('../../middlewares/asyncHandle.middleware');
const verifyMoMoSignature = require('../../middlewares/signature.middleware');
const router = express.Router();

router.post('/create-order', asyncHandle(OrderController.createOrder));
router.post('/payment', asyncHandle(OrderController.createPayment));
router.get('/callback', asyncHandle(OrderController.callback));
router.post(
  '/notify',
  verifyMoMoSignature,
  asyncHandle(OrderController.notify),
);

module.exports = router;
