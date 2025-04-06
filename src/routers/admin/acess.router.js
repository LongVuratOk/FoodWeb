'use strict';

const express = require('express');
const AccessController = require('../../controllers/admin/access.controller');
const router = express.Router();

router.post('/shop/signup', AccessController.signUp);

module.exports = router;
