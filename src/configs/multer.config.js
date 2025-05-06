'use strict';

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { BadRequestError } = require('../core/error.response');

const uploadMemory = multer({
  storage: multer.memoryStorage(),
});

const configStorage = (folder) => {
  const uploadPath = path.join(process.cwd(), 'src', 'uploads', folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniquePrefix = Date.now() + '-' + Math.random(Math.random * 1e9);
      cb(null, uniquePrefix + '-' + file.originalname);
    },
  });
};

const fileFilter = function (req, file, cb) {
  const allowMimes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        'Chỉ chấp nhận các file ảnh: jpeg, jpg, png, gif, webp!',
      ),
      false,
    );
  }
};

module.exports = {
  configStorage,
  fileFilter,
  uploadMemory,
};
