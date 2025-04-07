'use strict';

const express = require('express');
const { authentication } = require('../../auth/authentication');
const { asyncHandle } = require('../../middlewares/asyncHandle.middleware');
const productController = require('../../controllers/admin/product.controller');
const router = express.Router();

router.use(authentication);

router.post('/create', asyncHandle(productController.createProduct));
router.patch('/:_id', asyncHandle(productController.updateProduct));

module.exports = router;
