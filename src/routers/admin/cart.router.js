'use strict';

const express = require('express');
const router = express.Router();

const { asyncHandle } = require('../../middlewares/asyncHandle.middleware');
const { authentication } = require('../../auth/authentication');
const CartController = require('../../controllers/cart.controller');

router.use(authentication);

router.post('/', asyncHandle(CartController.addToCart));
router.post('/update', asyncHandle(CartController.updateCartQuatity));
router.delete('/', asyncHandle(CartController.deleteItemCart));
router.get('/', asyncHandle(CartController.getListUserCart));

module.exports = router;
