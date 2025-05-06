'use strict';

const ApiKeyRepository = require('../models/repositories/apiKey.repo');

class ApiKeyService {
  constructor() {
    this.apiKeyRepository = new ApiKeyRepository();
  }
  findByKey(key) {
    return this.apiKeyRepository.findOne({ key, status: true }).lean();
  }
}

module.exports = new ApiKeyService();
