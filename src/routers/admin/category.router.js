'use strict';

const express = require('express');
const { asyncHandle } = require('../../middlewares/asyncHandle.middleware');
const { authentication } = require('../../auth/authentication');
const CategoryController = require('../../controllers/category.controller');
const router = express.Router();

router.use(authentication);

router.get('/', asyncHandle(CategoryController.getAllCategories));
router.get('/publish/', asyncHandle(CategoryController.getAllCategoriesPub));
router.get('/draff/', asyncHandle(CategoryController.getAllCategoriesDraff));
router.get(
  '/search/:keySearch',
  asyncHandle(CategoryController.getListSearchCategory),
);

router.post('/create', asyncHandle(CategoryController.createCategory));
router.post('/publish/:_id', asyncHandle(CategoryController.publishCategory));
router.post(
  '/unPublish/:_id',
  asyncHandle(CategoryController.unPublishCategory),
);

router.patch('/:_id', asyncHandle(CategoryController.updateCategory));
router.delete('/:_id', asyncHandle(CategoryController.deleteCategory));

module.exports = router;
