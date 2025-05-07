'use strict';

const KeyTokenRepository = require('../models/repositories/keytoken.repo');
const { convertToObjectIdMongodb } = require('../utils');

class KeyTokenService {
  constructor() {
    this.keyTokenRepository = new KeyTokenRepository();
  }
  async createKeyToken({
    userId,
    publicKey,
    privateKey,
    verifyKey,
    refreshToken,
  }) {
    const filter = { user: userId },
      update = {
        publicKey,
        privateKey,
        verifyKey,
        refreshToken,
        refreshTokenUsed: [],
      },
      options = { upsert: true, new: true };

    const tokens = await this.keyTokenRepository.findOneAndUpdate(
      filter,
      update,
      options,
    );
    return tokens ? tokens.publicKey : null;
  }

  findByUserId(userId) {
    return this.keyTokenRepository.findOne({
      user: convertToObjectIdMongodb(userId),
    });
  }

  removeKeyById(id) {
    return this.keyTokenRepository.deleteOne({
      _id: convertToObjectIdMongodb(id),
    });
  }

  deleteKeyByUserId(userId) {
    return this.keyTokenRepository.deleteOne({
      user: convertToObjectIdMongodb(userId),
    });
  }
}

module.exports = new KeyTokenService();
