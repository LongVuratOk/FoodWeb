'use strict';

const express = require('express');
const AccessController = require('../../controllers/admin/access.controller');
const { asyncHandle } = require('../../middlewares/asyncHandle.middleware');
const router = express.Router();

router.post('/shop/login', asyncHandle(AccessController.login));
router.post('/shop/signup', asyncHandle(AccessController.signUp));

module.exports = router;
