'use strict';

const express = require('express');
const router = express.Router();
[''];

const { asyncHandle } = require('../../middlewares/asyncHandle.middleware');
const { authentication } = require('../../auth/authentication');
const UploadController = require('../../controllers/upload.controller');
const { product } = require('../../middlewares/upload.middleware');

router.post('/product', asyncHandle(UploadController.uploadImageFromUrl));
router.post(
  '/product/thumb',
  product.single('file'),
  asyncHandle(UploadController.uploadImageThumb),
);

module.exports = router;
