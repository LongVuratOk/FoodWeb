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
  /**
   * Xử lý refresh token
   * - Kiểm tra refreshToken có sử dụng lại hay không
   * - Xác thực token và người dùng
   * - Tạo access và refresh token mới
   * - Cập nhập refresh token vào db
   */
  static handleRefreshToken = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError('Có vấn đề. Hãy đăng nhập lại');
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new UnauthorizedError('Tài khoản chưa đăng ký');
    }

    const foundUer = await findByEmail({ email });
    if (!foundUer) {
      throw new UnauthorizedError('Tài khoản chưa đăng ký');
    }

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

  /**
   * Xử lý đăng xuất
   * - Xóa cặp key tạo token khỏi db
   */
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return {
      delKey: getInfoData({
        fields: ['_id', 'user', 'publicKey', 'privateKey', 'refreshToken'],
        object: delKey,
      }),
    };
  };

  /**
   * Xử lý đăng nhập
   * - Xác thực email và mật khẩu
   * - Tạo cặp key và cặp token mới
   * - Lưu thông tin key và token vào db
   */
  static login = async ({ email, password, refreshToken = null }) => {
    const foundUser = await findByEmail({ email });
    if (!foundUser) {
      throw new BadRequestError('Email hoặc mật khẩu không hợp lệ');
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      throw new BadRequestError('Email hoặc mật khẩu không hợp lệ');
    }

    const privateKey = await crypt.randomBytes(64).toString('hex');
    const publicKey = await crypt.randomBytes(64).toString('hex');

    const payload = {
      userId: foundUser._id,
      email,
    };

    const tokens = await createTokenPair(payload, publicKey, privateKey);

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

  /**
   * Đăng ký tài khoản mới
   * - Xác thực dữ liệu đầu vào
   * - Kiểm tra email tồn tại
   * - Tạo user, key, token mới
   */
  static signUp = async ({ name, email, password }) => {
    const { error } = validateCreateUser({ name, email, password });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const userFound = await findByEmail({ email });
    if (userFound) {
      throw new BadRequestError('Email đã tồn tại');
    }

    const newUser = await UserModel.create({
      name,
      email,
      password,
      roles: [ROLES.CUSTOMER],
    });

    if (newUser) {
      const privateKey = await crypt.randomBytes(64).toString('hex');
      const publicKey = await crypt.randomBytes(64).toString('hex');

      const tokens = await createTokenPair(
        { userId: newUser._id, email },
        publicKey,
        privateKey,
      );

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
