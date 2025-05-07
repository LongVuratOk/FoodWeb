'use strict';

const UserModel = require('../user.model');
const BaseRepository = require('./base.repo');

class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }
}

module.exports = UserRepository;
