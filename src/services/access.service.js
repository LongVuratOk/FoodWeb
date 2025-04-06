'use strict';

const { BadRequestError } = require('../core/error.response');
const UserModel = require('../models/user.model');
const ROLES = require('../constants/type.roles');
const { validateCreateUser } = require('../validations/user.valid');

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // validate data
    const { error } = validateCreateUser({ name, email, password });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

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
