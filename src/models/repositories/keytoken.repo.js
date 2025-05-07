const KeyTokenModel = require('../keytoken.model');
const BaseRepository = require('./base.repo');

class KeyTokenRepository extends BaseRepository {
  constructor() {
    super(KeyTokenModel);
  }

  findOneAndUpdate(filter, update, options) {
    return this.getModel().findOneAndUpdate(filter, update, options).lean();
  }
}

module.exports = KeyTokenRepository;
