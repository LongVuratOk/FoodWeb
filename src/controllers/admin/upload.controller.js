'use strict';

const { BadRequestError } = require('../../core/error.response');
const { OK } = require('../../core/success.response');
const UploadService = require('../../services/upload.service');

class UploadController {
  uploadImageFromUrl = async (req, res, next) => {
    new OK({
      message: 'Tải đường dẫn ảnh lên thành công',
      metadata: await UploadService.uploadFromUrl(),
    }).send(res);
  };

  uploadImageThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError('File missing');
    }
    new OK({
      message: 'Tải ảnh lên thành công',
      metadata: await UploadService.uploadFileFromLocal({
        path: file.path,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
