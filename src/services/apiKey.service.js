'use strict';

const ApiKeyModel = require('../models/apikey.model');

class ApiKeyService {
  static findByKey = async (key) => {
    return await ApiKeyModel.findOne({ key, status: true }).lean();
  };
}

module.exports = ApiKeyService;
