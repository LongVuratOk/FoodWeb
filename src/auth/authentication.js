'use strict';

const JWT = require('jsonwebtoken');

const HEADER = require('../constants/type.headers');
const { UnauthorizedError, NotFoundError } = require('../core/error.response');
const { asyncHandle } = require('../middlewares/asyncHandle.middleware');
const KeyTokenService = require('../services/keyToken.service');
const { token } = require('morgan');

const authentication = asyncHandle(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new UnauthorizedError('Invalid request');
  }

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError('Not Found keyStore');
  }

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decode = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decode.userId) {
        throw new UnauthorizedError('Invalid userId');
      }
      req.keyStore = keyStore;
      req.userId = userId;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new UnauthorizedError('Invalid request 2');
  }
  try {
    const decode = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decode.userId) {
      throw new UnauthorizedError('Invalid userId');
    }
    req.keyStore = keyStore;
    req.userId = userId;
    req.accessToken = accessToken;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  authentication,
  verifyJWT,
};
