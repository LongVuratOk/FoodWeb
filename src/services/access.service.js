'use strict';

const { BadRequestError } = require('../core/error.response');
const UserModel = require('../models/user.model');
const ROLES = require('../constants/type.roles');

class AccessService {
  static signUp = async ({ name, email, password }) => {
    const foundShop = await UserModel.findOne({ email });
    if (foundShop) {
      throw new BadRequestError('Email already exists');
    }

    const newUser = await UserModel.create({
      name,
      email,
      password,
      roles: [ROLES.CUSTOMER],
    });

    return {
      newUser,
    };
  };
}

module.exports = AccessService;
