'use strict';

const crypt = require('crypto');
const bcrypt = require('bcrypt');
const {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} = require('../core/error.response');
const UserModel = require('../models/user.model');
const ROLES = require('../constants/type.roles');
const { validateCreateUser } = require('../validations/user.valid');
const { getInfoData } = require('../utils');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/generateToken');
const { findByEmail } = require('../models/repositories/user.repo');

class AccessService {
  static handleRefreshToken = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;

    // check refreshToken is used
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError('Somthing wrong happen! Relogin');
    }

    // check refresh token is exists
    if (keyStore.refreshToken !== refreshToken) {
      throw new UnauthorizedError('Not registered');
    }

    // check email
    const foundUer = await findByEmail({ email });
    if (!foundUer) {
      throw new UnauthorizedError('Not registered');
    }

    // create token pair
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey,
    );

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });
    return {
      user,
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return {
      delKey: getInfoData({
        fields: ['_id', 'user', 'publicKey', 'privateKey', 'refreshToken'],
        object: delKey,
      }),
    };
  };

  static login = async ({ email, password, refreshToken = null }) => {
    // check email
    const foundUser = await findByEmail({ email });
    if (!foundUser) {
      throw new BadRequestError('Email/password wrong');
    }

    // compare pass
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      throw new BadRequestError('Email/password wrong');
    }

    // crreate key
    const privateKey = await crypt.randomBytes(64).toString('hex');
    const publicKey = await crypt.randomBytes(64).toString('hex');

    const payload = {
      userId: foundUser._id,
      email,
    };

    // create access, refresh token
    const tokens = await createTokenPair(payload, publicKey, privateKey);

    // save key pair
    await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      user: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundUser,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // validate data
    const { error } = validateCreateUser({ name, email, password });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // check user is exists
    const foundUser = await findByEmail({ email });
    if (foundUser) {
      throw new BadRequestError('Email already exists');
    }

    // create new user
    const newUser = await UserModel.create({
      name,
      email,
      password,
      roles: [ROLES.CUSTOMER],
    });

    if (newUser) {
      // create key
      const privateKey = await crypt.randomBytes(64).toString('hex');
      const publicKey = await crypt.randomBytes(64).toString('hex');

      // create access, refresh token
      const tokens = await createTokenPair(
        { userId: newUser._id, email },
        publicKey,
        privateKey,
      );

      // create token
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });

      if (!keyStore) {
        return {
          code: 500,
          message: 'keystore error',
        };
      }

      return {
        user: getInfoData({
          fields: ['_id', 'name', 'email'],
          object: newUser,
        }),
        tokens,
      };
    }
    return {
      user: null,
    };
  };
}

module.exports = AccessService;
