'use strict';

const AccessService = require('../../services/access.service');
const { OK, CREATED } = require('../../core/success.response');

class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Sign up successfully',
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  login = async (req, res, next) => {
    new OK({
      message: 'Login successfully',
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new OK({
      message: 'Logout successfully',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
}

module.exports = new AccessController();
