const ApiKeyModel = require('../apikey.model');
const BaseRepository = require('./base.repo');

class KeyRepository extends BaseRepository {
  constructor() {
    super(ApiKeyModel);
  }
}

module.exports = KeyRepository;
