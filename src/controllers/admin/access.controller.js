'use strict';

const AccessService = require('../../services/access.service');
const { OK, CREATED } = require('../../core/success.response');

class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Tạo tài khoản thành công',
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  login = async (req, res, next) => {
    new OK({
      message: 'Đăng nhập thành công',
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new OK({
      message: 'Đăng xuất thành công',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  refreshToken = async (req, res, next) => {
    new OK({
      message: 'Khởi tạo token thành công',
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };
}

module.exports = new AccessController();
