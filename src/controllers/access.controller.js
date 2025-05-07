'use strict';

const AccessService = require('../services/access.service');
const { OK, CREATED } = require('../core/success.response');

class AccessController {
  constructor() {
    this.accessService = new AccessService();
  }

  signUp = async (req, res, next) => {
    new CREATED({
      message:
        'Tạo tài khoản thành công. Vui lòng kiểm tra email để xác thực tài khoản',
      metadata: await this.accessService.signUp(req.body),
    }).send(res);
  };

  login = async (req, res, next) => {
    new OK({
      message: 'Đăng nhập thành công',
      metadata: await this.accessService.login(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new OK({
      message: 'Đăng xuất thành công',
      metadata: await this.accessService.logout(req.keyStore),
    }).send(res);
  };

  refreshToken = async (req, res, next) => {
    new OK({
      message: 'Khởi tạo token thành công',
      metadata: await this.accessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  resendVerify = async (req, res, next) => {
    new OK({
      message: 'Vui lòng kiểm tra email để xác thực tài khoản',
      metadata: await this.accessService.resendVerify(req.body.email),
    }).send(res);
  };

  handleVerifyEmail = async (req, res, next) => {
    new OK({
      message: 'Xác thực tài khoản thành công',
      metadata: await this.accessService.handleVerifyEmail({
        token: req.params.token,
      }),
    }).send(res);
  };
}

module.exports = new AccessController();
