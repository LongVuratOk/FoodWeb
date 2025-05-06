'use strict';

const { BadRequestError } = require('../core/error.response');
const { verifySignature } = require('../helpers/signature.payment');
const config = require('../configs/momo.config');

const verifyMoMoSignature = async (req, res, next) => {
  const { signature, ...data } = req.body;
  if (!signature) {
    throw new BadRequestError('Không tìm thấy chữ ký');
  }

  const isValid = verifySignature(data, config.secretKey, signature);
  if (!isValid) {
    throw new BadRequestError('Chữ ký không hợp lệ');
  }
  next();
};

module.exports = verifyMoMoSignature;
