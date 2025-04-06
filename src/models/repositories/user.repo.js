'use strict';

const UserModel = require('../user.model');

const findByEmail = async ({ email }) => {
  return await UserModel.findOne({ email });
};

module.exports = {
  findByEmail,
};
