'use strict';

const KeyModel = require('../models/keytoken.model');

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    const filter = { user: userId },
      update = {
        publicKey,
        privateKey,
        refreshToken,
        refreshTokenUsed: [],
      },
      options = { upsert: true, new: true };

    const tokens = await KeyModel.findOneAndUpdate(filter, update, options);
    return tokens ? tokens.publicKey : null;
  };
}

module.exports = KeyTokenService;
