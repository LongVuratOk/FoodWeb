'use strict';

const multer = require('multer');
const { configStorage, fileFilter } = require('../configs/multer.config');

const createUpload = (folder) => {
  return multer({
    storage: configStorage(folder),
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  });
};

const avatar = createUpload('avatar');
const product = createUpload('product');
const review = createUpload('review');
const category = createUpload('category');
module.exports = {
  avatar,
  product,
  review,
  category,
};
