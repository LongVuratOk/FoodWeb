'use strict';

const { ForbiddenError } = require('../core/error.response');

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objkey.permissions) {
      throw new ForbiddenError('Không có quyền truy cập');
    }
    const validPermission = req.objkey.permissions.includes(permission);
    if (!validPermission) {
      throw new ForbiddenError('Không có quyền truy cập');
    }
    return next();
  };
};

module.exports = permission;
