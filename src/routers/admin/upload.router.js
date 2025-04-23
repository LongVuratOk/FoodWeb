'use strict';

const express = require('express');
const router = express.Router();
[''];

const { asyncHandle } = require('../../middlewares/asyncHandle.middleware');
const { authentication } = require('../../auth/authentication');
const UploadController = require('../../controllers/admin/upload.controller');
const { uploadDisk } = require('../../configs/multer.config');

router.post('/product', asyncHandle(UploadController.uploadImageFromUrl));
router.post(
  '/product/thumb',
  uploadDisk.single('file'),
  asyncHandle(UploadController.uploadImageThumb),
);

module.exports = router;
