'use strict';

const express = require('express');
const apiKey = require('../middlewares/apiKey.middleware');
const permission = require('../middlewares/permissions.middleware');
const router = express.Router();

// middleware check api key

// router.use(apiKey);
// router.use(permission('0000'));

router.use('/v1/api/category', require('./admin/category.router'));
router.use('/v1/api', require('./admin/access.router'));

module.exports = router;
