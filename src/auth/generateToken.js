'use strict';

const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '30 days',
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

const createTokenVerify = async (payload, verifyKey) => {
  try {
    return JWT.sign(payload, verifyKey, {
      expiresIn: '180s',
    });
  } catch (error) {
    return error;
  }
};
module.exports = {
  createTokenPair,
  createTokenVerify,
};
