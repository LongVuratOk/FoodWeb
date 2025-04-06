'use strict';

const KeyModel = require('../models/keytoken.model');
const { convertToObjectIdMongodb } = require('../utils');

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

  static findByUserId = async (userId) => {
    return await KeyModel.findOne({ user: convertToObjectIdMongodb(userId) });
  };

  static removeKeyById = async (id) => {
    return await KeyModel.findByIdAndDelete(id);
  };
}

module.exports = KeyTokenService;
