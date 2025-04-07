'use strict';

const express = require('express');
const AccessController = require('../../controllers/admin/access.controller');
const { asyncHandle } = require('../../middlewares/asyncHandle.middleware');
const { authentication } = require('../../auth/authentication');
const router = express.Router();

router.post('/shop/login', asyncHandle(AccessController.login));
router.post('/shop/signup', asyncHandle(AccessController.signUp));

// authentication
router.use(authentication);

router.post('/shop/logout', asyncHandle(AccessController.logout));
router.post('/shop/refreshToken', asyncHandle(AccessController.refreshToken));

module.exports = router;
