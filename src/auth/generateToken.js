'use strict';

const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      expiresIn: '2 days',
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '30 days',
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

module.exports = {
  createTokenPair,
};
