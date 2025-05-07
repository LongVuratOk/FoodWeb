'use strict';

const express = require('express');
const OrderController = require('../../controllers/order.controller');
const { asyncHandle } = require('../../middlewares/asyncHandle.middleware');
const router = express.Router();

router.post('/create-order', asyncHandle(OrderController.createOrder));
router.post('/status/:_id', asyncHandle(OrderController.updateOrderStatus));

module.exports = router;
