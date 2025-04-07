'use strict';

const { ForbiddenError } = require('../core/error.response');

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objkey.permissions) {
      throw new ForbiddenError('Forbidden denied');
    }
    const validPermission = req.objkey.permissions.includes(permission);
    if (!validPermission) {
      throw new ForbiddenError('Forbidden denied');
    }
    return next();
  };
};

module.exports = permission;
