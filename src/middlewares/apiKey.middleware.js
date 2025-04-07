'use strict';

const HEADER = require('../constants/type.headers');
const { ForbiddenError } = require('../core/error.response');
const apikeyModel = require('../models/apikey.model');
const ApiKeyService = require('../services/apiKey.service');

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      throw new ForbiddenError('Forbidden error');
    }
    // check key
    const objkey = await ApiKeyService.findByKey(key);
    if (!objkey) {
      throw new ForbiddenError('Forbidden error');
    }
    req.objkey = objkey;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = apiKey;
