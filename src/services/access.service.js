'use strict';

const crypt = require('crypto');
const bcrypt = require('bcrypt');
const {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} = require('../core/error.response');
const ROLES = require('../constants/type.roles');
const { validateCreateUser } = require('../validations/user.valid');
const { getInfoData, convertToObjectIdMongodb } = require('../utils');
const { createTokenPair, createTokenVerify } = require('../auth/generateToken');
const UserRepository = require('../models/repositories/user.repo');
const verificaiton = require('../templat/verificationEmail');
const sendMail = require('../helpers/send.mail');
const JWT = require('jsonwebtoken');
const KeyTokenRepository = require('../models/repositories/keytoken.repo');
const KeyTokenService = require('./keyToken.service');

class AccessService {
  constructor() {
    this.userRepository = new UserRepository();
    this.keyTokenRepository = new KeyTokenRepository();
  }
  /**
   * Xử lý refresh token
   * - Kiểm tra refreshToken có sử dụng lại hay không
   * - Xác thực token và người dùng
   * - Tạo access và refresh token mới
   * - Cập nhập refresh token vào db
   */
  async handleRefreshToken({ refreshToken, user, keyStore }) {
    const { userId, email } = user;

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError('Có vấn đề. Hãy đăng nhập lại');
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new UnauthorizedError('Tài khoản chưa đăng ký');
    }

    const userExist = await this.userRepository.findOne({ email });
    if (!userExist) {
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
  }

  /**
   * Xử lý đăng xuất
   * - Xóa cặp key tạo token khỏi db
   */
  async logout(keyStore) {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return {
      delKey: getInfoData({
        fields: ['_id', 'user', 'publicKey', 'privateKey', 'refreshToken'],
        object: delKey,
      }),
    };
  }

  /**
   * Xử lý đăng nhập
   * - Xác thực email và mật khẩu
   * - Tạo cặp key và cặp token mới
   * - Lưu thông tin key và token vào db
   */
  async login({ email, password, refreshToken = null }) {
    const userExist = await this.userRepository.findOne({ email });
    if (!userExist) {
      throw new BadRequestError('Email hoặc mật khẩu không hợp lệ');
    }

    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      throw new BadRequestError('Email hoặc mật khẩu không hợp lệ');
    }

    const privateKey = await crypt.randomBytes(64).toString('hex');
    const publicKey = await crypt.randomBytes(64).toString('hex');
    const verifyKey = await crypt.randomBytes(64).toString('hex');

    if (!userExist.verify) {
      await KeyTokenService.createKeyToken({
        userId: userExist._id,
        publicKey: null,
        privateKey: null,
        verifyKey,
        refreshToken: null,
      });

      await this.createAndSendVerify(userExist, verifyKey);
      throw new UnauthorizedError(
        'Tài khoản chưa được xác thực.Chúng tôi đã gửi email xác thực mới đến hộp thư của bạn.',
      );
    }

    const payload = {
      userId: userExist._id,
      email,
    };

    const tokens = await createTokenPair(payload, publicKey, privateKey);

    await KeyTokenService.createKeyToken({
      userId: userExist._id,
      publicKey,
      privateKey,
      verifyKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      user: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: userExist,
      }),
      tokens,
    };
  }

  /**
   * Đăng ký tài khoản mới
   * - Xác thực dữ liệu đầu vào
   * - Kiểm tra email tồn tại
   * - Tạo user, key, token mới
   */
  async signUp({ name, email, password }) {
    const { error } = validateCreateUser({ name, email, password });
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const userExist = await this.userRepository.findOne({ email });
    if (userExist) {
      throw new BadRequestError('Email đã tồn tại');
    }

    const newUser = await this.userRepository.create({
      name,
      email,
      password,
      roles: [ROLES.CUSTOMER],
    });

    if (newUser) {
      const verifyKey = await crypt.randomBytes(64).toString('hex');

      await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey: null,
        privateKey: null,
        verifyKey,
        refreshToken: null,
      });

      await this.createAndSendVerify(newUser, verifyKey);

      return {
        user: getInfoData({
          fields: ['_id', 'name', 'email'],
          object: newUser,
        }),
      };
    }
    return {
      user: null,
    };
  }

  async createAndSendVerify(user, verifyKey) {
    const email = user.email;

    const verificationToken = await createTokenVerify({ email }, verifyKey);
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 3 * 60 * 1000;
    await user.save();

    const verificationUrl = `http://localhost:3055/v1/api/shop/verify/${verificationToken}`;
    const html = verificaiton(user.name, verificationUrl);
    await sendMail(email, 'Xác thực email', html);
    return verificationToken;
  }

  async resendVerify(email) {
    const userExist = await this.userRepository.findOne({ email });
    if (!userExist) {
      throw new BadRequestError('Email không tồn tại');
    }

    if (userExist.verify) {
      throw new BadRequestError('Tài khoản đã được xác thực');
    }

    const verifyKey = await crypt.randomBytes(64).toString('hex');

    await KeyTokenService.createKeyToken({
      userId: userExist._id,
      publicKey: null,
      privateKey: null,
      verifyKey,
      refreshToken: null,
    });

    await this.createAndSendVerify(userExist, verifyKey);
    return 'OK';
  }

  async handleVerifyEmail({ token }) {
    const user = await this.userRepository.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new UnauthorizedError('Token không hợp lệ hoặc đã hết hạn');
    }

    const keyToken = await this.keyTokenRepository.findOne({
      user: convertToObjectIdMongodb(user._id),
    });

    if (!keyToken || !keyToken.verifyKey) {
      throw new BadRequestError('Không tìm thấy key xác thực');
    }
    try {
      const decode = JWT.verify(token, keyToken.verifyKey);
      if (decode.email !== user.email) {
        throw new UnauthorizedError('Email không hợp lệ');
      }
    } catch (error) {
      throw new BadRequestError(error.message);
    }
    user.verify = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    const privateKey = await crypt.randomBytes(64).toString('hex');
    const publicKey = await crypt.randomBytes(64).toString('hex');

    const payload = {
      userId: user._id,
      email: user.email,
    };

    const tokens = await createTokenPair(payload, publicKey, privateKey);

    await KeyTokenService.createKeyToken(user._id, {
      publicKey,
      privateKey,
      verifyKey: null,
      refreshToken: tokens.refreshToken,
    });

    return {
      user: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: user,
      }),
      tokens,
    };
  }
}

module.exports = AccessService;
